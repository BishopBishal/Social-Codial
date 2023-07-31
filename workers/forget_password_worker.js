const queue = require('../configs/kue');
const forgetPasswordMailer = require('../mailers/forgot_password');


queue.process('forgetPassword', function (job, done) {
    console.log('Email worker started and processing a job:- ', job.data);
    forgetPasswordMailer.forgetPasswordMailer(job.data);
    done();
});