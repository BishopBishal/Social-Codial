{
    //console.log("hello world");
    //method to submit the form data for new post using ajax request
    let createPost = function () {
        let newPostForm = $('#new-form-post');
        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'POST',
                url: '/post/create-post',
                data: newPostForm.serialize(),
                success: function (data) {
                    //console.log("The user is found ", data);
                    let newPost = newPostDom(data.data.post, data.data.username);
                    $('#post-section>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    if (data.message && data.message.length > 0) {
                        new Noty({
                            theme: 'relax',
                            text: data.message,
                            type: "success",
                            layout: "topRight",
                            timeout: 1500
                        }).show();
                    }
                }, error: function (error) {
                    console.error(error.responseText);
                }
            });
        });

    };

    //method to create a post in DOM
    let newPostDom = function (post, username) {
        return $(`<li id="post-${post._id}">
        ${post.content}
            <a class="delete-post-button" href="/post/delete-post/${post._id}"><i class="fa fa-times-circle"></i></a>
              <br>
              <small>
                ${username}
              </small>
              <div id="comment-section">
                
                  <form action="/comment/create-comment" method="post">
                    <input type="text" name="content" id="comment" placeholder="Type your comment here ..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <button type="submit">Add Comment</button>
                  </form>
      
                    <div id="post-comment-list">
                      <ul id="post-comment-${post._id}">
                      </ul>
                    </div>
              </div>
      </li>`)
    };


    //Method to delete a Post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault(); // prevent

            $.ajax({
                type: "get",
                url: $(deleteLink).prop("href"),
                success: function (data) {
                    //console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    if (data.message && data.message.length > 0) {
                        new Noty({
                            theme: 'relax',
                            text: data.message,
                            type: "success",
                            layout: "topRight",
                            timeout: 1500
                        }).show();
                    }
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    };

    //method to submit the form data to new comments using ajax request
    // let creatComment = function () {

    //     let newCommentForm = $('new-form-comment');
    //     newCommentForm.submit(function (e) {
    //         e.preventDefault();

    //         $.ajax({
    //             type: 'POST',
    //             url: '/comments/create-comment',
    //             data: newPostForm.serialize(),
    //             success: function (data) {
    //                 let newComment = newCommentDom(data.data.comment, data.data.username);
    //             },
    //             error: function (error) {
    //                 console.error(error.responseText);
    //             }
    //         })
    //     });
    // }

    createPost();
}