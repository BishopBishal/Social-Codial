const Post = require('../models/post');
const Comment = require('../models/comments');
const User = require("../models/user");

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


module.exports.destroyPost=async function(req, res){
    try{
      console.log("Got the post id from the req",req.params.id);
      const oldPost =await Post.findById(req.params.id);
      await Post.findByIdAndDelete(req.params.id)
      //mongoose give use to  req.user.id instead of _id which is a string version of the id
      if(oldPost && oldPost.user == req.user.id)
      {
        const commentIds = oldPost.comments;
        if(commentIds)
        {
          await Comment.deleteMany({ _id: { $in: commentIds } });
          return res.redirect('back');
        }
        else{
          console.log("No comment found for this comment array --> ",post.comments);
          return res.redirect('back');
        }
        
      }
      console.log("No post found for this post id --> ",req.params.id," or the user is not who is posted to post userid --> ",req.user.id);
      return res.redirect('back');
    }catch(err){
      console.error("Error destroying post",err);
      return res.redirect('back');
    }
  }