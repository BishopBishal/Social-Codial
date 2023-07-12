const Post = require('../models/post');

module.exports.createUser = async function(req,res){
    try{
   const newPost= await Post.create({
        content: req.body.content,
        user:req.user._id,
    });
        console.log('Successfully created new post:- ', newPost);
        return res.redirect('back');
}
catch(err){
    if(err){console.log("Error While creating a Post :",err);}
    return res.redirect('back');
}
    
}