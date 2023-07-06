const User =require("../models/User");
module.exports.profile=async function(req, res){
    try
    {
        if(Object.keys(req.cookies).length > 0)
        {
                console.log('requested cookies:- ',req.cookies);
                const user =await User.findById(req.cookies.user_id);
                console.log(user);
                if(user != null){
                    return res.render('userProfile',{
                        title: "Profile",
                        userList : [user]
                });
                }
            
            
        }
        else{
            console.log("No cookie for user ");
            return res.redirect('/user/signin');
        }
    }
    catch(err){
        return res.status(500).send('Internal Server Error');
    }

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
        return  res.status(500).send("Internal Server Error"+err);
    }
};

module.exports.createSession=async function(req, res){
    //Do it later
    // console.log('createSession',req.body);
    // return res.redirect('back');
    try{
        //find the user
        const olduser=await User.findOne({email : req.body.email, password : req.body.password});
        console.log('user found',olduser,req.body);
          
        //handle user found
        if(olduser != null)
        {
           
              //handle session creation which means cookies
              res.cookie('user_id',olduser.id);
              return res.redirect('/user/profile');

        }
        else{
            //handle user not found
            return res.redirect('back');
        }
       
    }
    catch(err){
        return res.status(500).send("Internal Server Error"+err);
    }
};