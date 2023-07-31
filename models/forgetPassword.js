const mongoose = require('mongoose');

const forgetPasswordSchema = new mongoose.Schema({
    accessToken: {
        type: 'string',
        required: true,
        unique: true
    },
    isVaild: {
        type: 'boolean',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const forgetPassword = mongoose.model('forgetpassword', forgetPasswordSchema);

module.exports = forgetPassword;