const Post = require("../models/post");
const Comment = require('../models/comments');
const User = require("../models/user");
module.exports.home = async function (req, res) {
  try {

    // console.log("value of user id:- "+req.user._id);
    const post = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        },
        options: { sort: { createdAt: -1 } }
      })
      .exec();
    const allUsers = await User.find({});
    // console.log("post are :- "+post);
    return res.render('home', { title: 'HomePage || Codial', PostList: post, allUsers: allUsers });

  } catch (err) {
    console.error("Error rendering home page", err);
    return res.redirect('/user/signin');
  }

}



//module.exports.actionName=function (req,res){ return res.end("<h1>Action</h1>");}