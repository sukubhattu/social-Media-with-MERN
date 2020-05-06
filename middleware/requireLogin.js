const JWT = require("jsonwebtoken");
const keys = require("../configuration/keys");
const JWTSecret = keys.JWTSecret.mysecret;
const mongoose = require("mongoose");
const User = mongoose.model("User");
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // authorization looks like this
    // authorization === Bearer <token>
    if (!authorization) {
        return res.status(403).send("403 Forbidden");
    }
    const token = authorization.replace("Bearer ", "");
    // verifying token
    JWT.verify(token, JWTSecret, (err, payload) => {
        if (err) {
            return res.status(403).send("You should be logged in");
        }
        const { id } = payload;
        User.findById(id)
            .then((userData) => {
                req.user = userData;
            })
            .catch();
        next();
    });
};
