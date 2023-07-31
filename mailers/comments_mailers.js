const nodeMailer = require('../configs/nodemailer');

//this is the another way to export your methods
exports.newComment = (comment) => {
    console.log("Inside newComment Mailer");
    let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');
    nodeMailer.transporter.sendMail({
        from: "##",
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString
    }, function (error, info) {
        if (error) {
            console.log("Error Occured while publishing mail", error);
            return;
        }

        console.log("Comment Mail Sent Successfully", info);
        return;
    });
}