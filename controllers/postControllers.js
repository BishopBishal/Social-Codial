const Post = require('../models/post');
const Comment = require('../models/comments');
const User = require("../models/user");
const { request } = require('express');

module.exports.createPost = async function (req, res) {
  try {
    console.log('Data type of post:', typeof req.body.content);
    const newPost = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    //console.log("request came form username: " + req.user.name);
    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: newPost,
          username: req.user.name
        },
        message: "New post created successfully"
      });
    }
    req.flash('success', 'New Post has been Posted by ' + req.user.name);
    console.log('Successfully created new post:- ', newPost);
    return res.redirect('back');
  }
  catch (err) {
    req.flash('error', 'Error creating new post');
    if (err) { console.log("Error While creating a Post :", err); }
    return res.redirect('back');
  }

}


module.exports.destroyPost = async function (req, res) {
  try {
    console.log("Got the post id from the req", req.params.id);
    const oldPost = await Post.findById(req.params.id);
    await Post.findByIdAndDelete(req.params.id)
    //mongoose give use to  req.user.id instead of _id which is a string version of the id
    if (oldPost && oldPost.user == req.user.id) {
      const commentIds = oldPost.comments;
      if (commentIds) {
        await Comment.deleteMany({ _id: { $in: commentIds } });
        if (req.xhr) {
          return res.status(200).json({
            data: {
              post_id: req.params.id
            },
            message: "Post Deleted successfully"
          });
        }
        req.flash('success', 'Post has been Deleted successfully Along with Comments');
        return res.redirect('back');
      }
      else {
        console.log("No comment found for this comment array --> ", post.comments);
        req.flash('success', 'Post has been Deleted successfully With no Comments');
        return res.redirect('back');
      }

    }
    req.flash('error', 'No post found !!');
    console.log("No post found for this post id --> ", req.params.id, " or the user is not who is posted to post userid --> ", req.user.id);
    return res.redirect('back');
  } catch (err) {
    req.flash('error', 'Error destroying post!!');
    console.error("Error destroying post", err);
    return res.redirect('back');
  }
}