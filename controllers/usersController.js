const passport = require("passport");
const User =require("../models/user");
module.exports.profile=async function(req, res){
    try{
        const oldUser= await User.findById(req.params.id);
        console.log('found the old user', oldUser);
        return res.render('userProfile',{title : 'ProfilePage',profileUser : oldUser});
    }
    catch(err){
        console.error('Not able to find the user with userid -->',req.param.id,err);
        return res.render('userProfile',{title : 'ProfilePage'});
    }
    
};


module.exports.signup=function(req, res){
    if(req.isAuthenticated())
    {
        let redirectPath='/user/profile/'+req.user.id;
        console.log(redirectPath);
        return res.redirect(redirectPath);
    }
    return res.render('userSignup',{title : 'Codial | Signup Page'});
};

module.exports.signin=function(req, res){
    if(req.isAuthenticated())
    {
        let redirectPath='/user/profile/'+req.user.id;
        console.log(redirectPath);
        return res.redirect(redirectPath);
    }
    return res.render('userSignin',{title : 'Codial | Signin Page'});
};

module.exports.createUser=async function(req, res){
    try{
        if(req.body.email != req.body.confirmEmail)
        {
            req.flash('error','Confirmation email does not match with email');
            console.log('Confirmation email does not match with email',req.body);   
            return res.redirect('back');
        }
   
    
        const newUser=await User.findOne({email : req.body.email});
        if(newUser == null)
        {
            const newCreatedUser=await User.create(req.body);
            req.flash('success','User successfully created');
            console.log('Created user',newCreatedUser);
                return res.redirect('/user/signin');
        }
        else{
            req.flash('error','User already exists');
            console.log('Duplicate Entry... You can make only one user with one emailId !!!');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error','Internal Server Error');
        return  res.status(500).send("Internal Server Error",err);
    }
};

module.exports.createSession=function(req, res){
    console.log('createSession',req.body);
    req.flash('success','Logged In Successfully');
    let redirectPath='/user/profile/'+req.user.id;
    console.log(redirectPath);
    return res.redirect(redirectPath);
};

module.exports.signOut = function(req, res) {
    req.flash('success', 'Logged Out Successfully');
    req.logout(function(err) {
            if (err) {
              console.log("Error happpend on sign out",err);
              req.flash('error', 'Error occurred while signing out ' + err);
            } else {
              req.flash('success', 'Logged Out Successfully');
            }});
            return res.redirect('/user/signin');
        };
  



module.exports.updateUser =async function(req, res){
    try{
        console.log('updating user',req.params.id,'request changed user ---> ',req.body);
        if(req.user.id ==req.params.id)
        {
            const oldUser =await User.findByIdAndUpdate(req.params.id,req.body);
            console.log("user updated successfully " + oldUser);
            req.flash=('success','User has been updated successfully');
            return res.redirect('back');
        }
        else
        {
            req.flash('error', 'You are not allowed to Update this user');
            console.log("UnAuthorized user is trying to update",req.user.id,req.params.id);
            return res.status(401).send('Unauthorized User');
        }
    }
    catch(err){
        req.flash('error', 'error while updating user');
        console.log('error while updating user',err);
        return res.redirect('back');
    }
};
