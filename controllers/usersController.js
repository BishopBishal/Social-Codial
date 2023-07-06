const User =require("../models/User");
module.exports.profile=function(req, res){
    return res.render('userProfile',{title : 'ProfilePage'});
}


module.exports.signup=function(req, res){
    return res.render('userSignup',{title : 'Codial | Signup Page'});
}

module.exports.signin=function(req, res){
    return res.render('userSignin',{title : 'Codial | Signin Page'});
}

module.exports.createUser=async function(req, res){
    //Do it later
    // console.log('createUser',req.body,'cookies:- ',req.cookies);
    // res.cookie('user_id',25);

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
    //Do it later
    console.log('createSession',req.body);
    return res.redirect('back');
};