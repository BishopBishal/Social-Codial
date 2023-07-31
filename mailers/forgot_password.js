const nodeMailer = require('../configs/nodemailer');

//this is the another way to export your methods
exports.forgetPasswordMailer = (forgetPasswordInstance) => {
    console.log("Inside forgetPassword Mailer");
    let htmlString = nodeMailer.renderTemplate({ forgetPasswordInstance: forgetPasswordInstance }, '/forgotPassword/forgot_password.ejs');
    nodeMailer.transporter.sendMail({
        from: "##",
        to: forgetPasswordInstance.user.email,
        subject: "Reset Your Socials-Codial password",
        html: htmlString
    }, function (error, info) {
        if (error) {
            console.log("Error Occured while publishing mail", error);
            return;
        }

        console.log("Reset Password Mail Sent Successfully", info);
        return;
    });
}