const passport = require("passport");
const User = require("../models/user");
const ForgetPassword = require('../models/forgetPassword');
const crypto = require('crypto');
const fs = require("fs");
const path = require("path");
const queue = require('../configs/kue');
const forgetPasswordMailer = require('../workers/forget_password_worker');



module.exports.profile = async function (req, res) {
    try {
        const oldUser = await User.findById(req.params.id);
        console.log('found the old user', oldUser);
        return res.render('userProfile', { title: 'ProfilePage', profileUser: oldUser });
    }
    catch (err) {
        console.error('Not able to find the user with userid -->', req.param.id, err);
        return res.render('userProfile', { title: 'ProfilePage' });
    }

};


module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        let redirectPath = '/user/profile/' + req.user.id;
        console.log(redirectPath);
        return res.redirect(redirectPath);
    }
    return res.render('userSignup', { title: 'Codial | Signup Page' });
};

module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        let redirectPath = '/user/profile/' + req.user.id;
        console.log(redirectPath);
        return res.redirect(redirectPath);
    }
    return res.render('userSignin', { title: 'Codial | Signin Page' });
};

module.exports.createUser = async function (req, res) {
    try {
        if (req.body.email != req.body.confirmEmail) {
            req.flash('error', 'Confirmation email does not match with email');
            console.log('Confirmation email does not match with email', req.body);
            return res.redirect('back');
        }


        const newUser = await User.findOne({ email: req.body.email });
        if (newUser == null) {
            const newCreatedUser = await User.create(req.body);
            req.flash('success', 'User successfully created');
            console.log('Created user', newCreatedUser);
            return res.redirect('/user/signin');
        }
        else {
            req.flash('error', 'User already exists');
            console.log('Duplicate Entry... You can make only one user with one emailId !!!');
            return res.redirect('back');
        }
    }
    catch (err) {
        req.flash('error', 'Internal Server Error');
        return res.status(500).send("Internal Server Error", err);
    }
};

module.exports.createSession = function (req, res) {
    console.log('createSession', req.body);
    req.flash('success', 'Logged In Successfully');
    let redirectPath = '/user/profile/' + req.user.id;
    console.log(redirectPath);
    return res.redirect(redirectPath);
};

module.exports.signOut = function (req, res) {
    req.flash('success', 'Logged Out Successfully');
    req.logout(function (err) {
        if (err) {
            console.log("Error happpend on sign out", err);
            req.flash('error', 'Error occurred while signing out ' + err);
        } else {
            req.flash('success', 'Logged Out Successfully');
        }
    });
    return res.redirect('/user/signin');
};




module.exports.updateUser = async function (req, res) {
    try {
        // console.log('updating user',req.params.id,'request changed user ---> ',req.body);
        if (req.user.id == req.params.id) {
            // const oldUser =await User.findByIdAndUpdate(req.params.id,req.body);
            const oldUser = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) console.log("******************************** Multer Error : " + err);
                oldUser.email = req.body.email;
                oldUser.name = req.body.name;
                if (req.file) {

                    if (oldUser.avatar && fs.existsSync(path.join(__dirname, "..", oldUser.avatar))) {
                        fs.unlinkSync(path.join(__dirname, "..", oldUser.avatar));
                    }
                    oldUser.avatar = User.avatarPath + '/' + req.file.filename;
                }
                oldUser.save();
                console.log("user updated successfully " + oldUser);
                req.flash = ('success', 'User has been updated successfully');
                return res.redirect('back');
            });
        }
        else {
            req.flash('error', 'You are not allowed to Update this user');
            console.log("UnAuthorized user is trying to update", req.user.id, req.params.id);
            return res.status(401).send('Unauthorized User');
        }
    }
    catch (err) {
        req.flash('error', 'error while updating user');
        console.log('error while updating user', err);
        return res.redirect('back');
    }
};


module.exports.forgetPassword = function (req, res) {
    return res.render('forgetPassword', { title: 'Forget Password' });
}

module.exports.confirmEmail = async function (req, res) {
    try {
        console.log('form body data', req.body);
        if (req.body.email == req.body.confirm_email) {
            const oldUser = await User.findOne({ email: req.body.email });
            console.log('old user', oldUser);
            if (oldUser) {
                const forgetPassword = await ForgetPassword.create({
                    accessToken: crypto.randomBytes(20).toString('hex'),
                    isVaild: true,
                    user: oldUser._id
                });
                await ForgetPassword.populate(forgetPassword, { path: 'user' });
                console.log('forgot password  instance has been created', forgetPassword);
                let job = queue.create('forgetPassword', forgetPassword).save(function (err) {
                    if (err) {
                        console.log('Error hapended while adding job to queue:- ', err);
                        return;
                    }

                    console.log('Job added to queue:- ', job._id);
                });

                return res.redirect('back');

            }
            return res.redirect('back');
        }

    }
    catch (err) {
        console.log('Error occured while trying to Forget Password', err);
        return res.redirect('back');
    }
};


module.exports.resetPassword = async function (req, res) {
    try {
        console.log('query param for reset password', req.query.accesstoken);
        const oldForgetPasswordUser = await ForgetPassword.findOne({ accessToken: req.query.accesstoken });
        const oldForgetPasswordUserduplicate = oldForgetPasswordUser;
        await ForgetPassword.populate(oldForgetPasswordUser, { path: 'user' });
        console.log('oldForgetPassword user :- ', oldForgetPasswordUser);
        if (oldForgetPasswordUser && oldForgetPasswordUser.isVaild == true) {
            await ForgetPassword.findByIdAndDelete(oldForgetPasswordUserduplicate._id);
            return res.render('changePassword', { oldUser: oldForgetPasswordUser, title: 'Social Change Password' });
        }

        return res.render('InvalidSignIn', { title: 'Social Change Password', message: 'Token Expired or User not found' });
    }
    catch (err) {
        console.log('Error occured while validating or reseting the password', err);
        return res.render('InvalidSignIn', { title: 'Social Change Password', message: 'Error Occured While Reseting Password' });
    }
};


module.exports.changePassword = async function (req, res) {
    try {
        console.log('changePassword query param found:- ' + req.body);
        const oldUser = await User.findById(req.body.userid);
        console.log('Old User found in changePassword:- ', oldUser);
        if (oldUser) {
            oldUser.password = req.body.password;
            oldUser.save();
            console.log('Password changed successfully', oldUser);
            res.redirect('/user/signin');
        }
    }
    catch (err) {
        console.log('Error occured while changing the password ', err);
        return res.redirect('/user/signin');
    }

};