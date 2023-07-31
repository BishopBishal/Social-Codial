const Comment = require('../models/comments');
const Post = require('../models/post');
const commentMailer = require('../mailers/comments_mailers');
const User = require('../models/user');
const queue = require('../configs/kue');
const commentEmailWorker = require('../workers/comment_email_worker');


module.exports.createComment = async function (req, res) {
    try {

        const post = await Post.findById(req.body.post);
        console.log("comment is created for post id --> ", req.body.post);
        // console.log('Data type of post:', typeof req.body.content);

        if (post) {
            const newComment = await Comment.create({
                content: req.body.content,
                post: req.body.post.trim(),
                user: req.user._id
            });
            post.comments.push(newComment);
            post.save();
            console.log('new comment:- ', newComment);
            await Comment.populate(newComment, { path: 'user' });
            console.log('new user.email :- ', newComment);

            //Adding Delayed job to send email notification

            let job = queue.create('email', newComment).save(function (err) {
                if (err) {
                    console.log('Error hapended while adding job to queue:- ', err);
                    return;
                }

                console.log('Job added to queue:- ', job._id);
            });


            // Sending email using commentMailer
            // commentMailer.newComment(newComment);
            if (req.xhr) {
                // console.log('XHR Request Data:', newCommentForm.serialize());
                return res.status(200).json({
                    data: {
                        comment: newComment,
                        username: req.user.name
                    },
                    message: "New comment created successfully"
                });
            }
            req.flash('success', 'New Comment has been Added');
            return res.redirect('/');
        }
        req.flash('error', "Can't Add Comment to this Post");
        console.log("Can't find post with id " + req.body.post.id);
        return res.redirect('back');
    } catch (err) {
        req.flash('error', "Error creating comment");
        console.error("Error creating comment", err);
        return res.redirect('back');
    }
};

module.exports.destroyComment = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        console.log('got the comment from database --> ', comment);
        if (req.user.id == comment.user && comment) {
            await Comment.findByIdAndDelete(comment.id);
            await Post.findByIdAndUpdate(comment.post, { $pull: { comments: req.params.id } });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comments Deleted successfully"
                });
            }

            req.flash('success', "Comment has been Deleted");
            return res.redirect('back');
        }
        else {
            req.flash('error', "Can't Delete Comment to this Post");
            console.log('comment is null or empty', comment.user, ' or the user id does not match with comment id -->', req.user.id);
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', "Error deleting the comment");
        console.error("Error deleting the comment", err);
        return res.redirect('back');
    }
};