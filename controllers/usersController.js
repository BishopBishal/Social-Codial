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
            console.log('Confirmation email does not match with email',req.body);   
            return res.redirect('back');
        }
   
    
        const newUser=await User.findOne({email : req.body.email});
        if(newUser == null)
        {
            const newCreatedUser=await User.create(req.body);
            console.log('Created user',newCreatedUser);
                return res.redirect('/user/signin');
        }
        else{
            console.log('Duplicate Entry... You can make only one user with one emailId !!!');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        return  res.status(500).send("Internal Server Error",err);
    }
};

module.exports.createSession=function(req, res){
    console.log('createSession',req.body);
    let redirectPath='/user/profile/'+req.user.id;
    console.log(redirectPath);
    return res.redirect(redirectPath);
};

module.exports.signOut=function(req, res){
    req.logout(function(err){
        if(err)
        {
            console.log('error happened while signing out',err);
            return ;
        }
        console.log("successfully logout");
    });
    return res.redirect('/user/signin');
};

module.exports.updateUser =async function(req, res){
    try{
        console.log('updating user',req.params.id,'request changed user ---> ',req.body);
        if(req.user.id ==req.params.id)
        {
            const oldUser =await User.findByIdAndUpdate(req.params.id,req.body);
            console.log("user updated successfully " + oldUser);
            return res.redirect('back');
        }
        else
        {
            console.log("UnAuthorized user is trying to update",req.user.id,req.params.id);
            return res.status(401).send('Unauthorized User');
        }
    }
    catch(err){
        console.log('error while updating user',err);
        return res.redirect('back');
    }
};
