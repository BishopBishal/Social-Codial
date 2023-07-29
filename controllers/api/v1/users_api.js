const User = require('../../../models/user');
const jwt = require('jsonwebtoken');


module.exports.createSession = async function (req, res) {

    try {
        const foundUser = await User.findOne(req.params.email);

        // console.log(foundUser, '---' + req.body.password);
        if (!foundUser || foundUser.password != req.body.password) {
            return res.json(422,
                {
                    message: "Invalid Username/Password"
                });
        }

        return res.json(200, {
            message: "Sign In Successfully here is your token",
            data: {
                token: jwt.sign(foundUser.toJSON(), 'neverlosehope', { expiresIn: '1000000' })
            }
        });

    } catch (err) {
        console.log('Error while creating Session: ' + err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }

};