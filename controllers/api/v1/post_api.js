const Post = require('../../../models/post');
const User = require('../../../models/user');
const Comment = require('../../../models/comments');


module.exports.findAllPost = async function (req, res) {
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
        return res.json(200, {
            posts: post,
            message: 'success'
        });

    } catch (err) {
        console.error("Error rendering home page", err);
        return res.json(500, {
            allUsers: [],
            message: 'Internal Server Error'
        });
    }

}


module.exports.deletePost = async function (req, res) {
    try {
        const oldPost = await Post.findById(req.params.id);
        console.log(oldPost.user, "-----", req.user.id);
        if (oldPost.user == req.user.id) {
            await Post.findByIdAndDelete(req.params.id)
            //mongoose give use to  req.user.id instead of _id which is a string version of the id
            const commentIds = oldPost.comments;
            if (commentIds) {
                await Comment.deleteMany({ _id: { $in: commentIds } });
            }
            return res.json(200, {
                oldPost,
                commentIds,
                message: 'Success'
            });
        }
        else {
            return res.json(422,
                {
                    message: 'Invalid User cannot delete this post'
                });
        }
    } catch (err) {
        console.error("Error destroying post", err);
        return res.json(200, {
            message: 'Internal Server Error'
        });
    }
}


