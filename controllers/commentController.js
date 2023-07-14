const Comment =require('../models/comments');
const Post =require('../models/post');

module.exports.createComment =async function(req,res){
    try{

        console.log('Found post id--> ' + req.body.post);
        const post =await Post.findById(req.body.post);
        console.log('Found post --> ' + post);
        if(post){
            const newComment = await Comment.create({
                content: req.body.content,
                post:req.body.post.trim(),
                user:req.user._id
            });
           post.comments.push(newComment);
           post.save();
           return res.redirect('/');
        }
        console.log("Can't find post with id " + req.body.post.id);
        return res.redirect('back');
    }catch(err){
        console.error("Error creating comment",err);
        return res.redirect('back');
    }
};

module.exports.destroyComment =async function(req, res){
    try{
        const comment= await Comment.findById(req.params.id);
        console.log('got the comment from database --> ', comment);
        if(req.user.id == comment.user && comment ){
            await Comment.findByIdAndDelete(comment.id);
            await Post.findByIdAndUpdate(comment.post,{ $pull : {comments :req.params.id}});
            return res.redirect('back');
        }
        else
        {
            console.log('comment is null or empty', comment.user,' or the user id does not match with comment id -->',req.user.id);
            return res.redirect('back');
        }
    }catch(err)
    {
        console.error("Error deleting the comment",err);
    }
};