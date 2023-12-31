const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type:'String',
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //Adding comment to the posts to fetch this property fastly as this is too frequent thing
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
},{
    timestamps:true
});

const Post=mongoose.model('Post',postSchema);

module.exports=Post;