const queue = require('../configs/kue');
const commentMailer = require('../mailers/comments_mailers');


queue.process('email', function (job, done) {
    console.log('Email worker started and processing a job:- ', job.data);
    commentMailer.newComment(job.data);
    done();
});