const Post = require("../models/post");

module.exports.home=async function (req,res){
  try{
      
     // console.log("value of user id:- "+req.user._id);
      const post=await Post.find({}).populate('user')
      .populate({
        path:'comments',
        populate:{
          path:'user'
        }
      })
      .exec();
      // console.log("post are :- "+post);
        return  res.render('home',{title:'HomePage',Post:post});

  }catch(err)
  {
    console.error("Error rendering home page",err);
    return res.redirect('/user/signin');
  }
  
}

//module.exports.actionName=function (req,res){ return res.end("<h1>Action</h1>");}