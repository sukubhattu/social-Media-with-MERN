// lets import express and router
const express = require("express");
const router = express.Router();
// importing mongoose
const mongoose = require("mongoose");
// importing JWT for authorization puropose
const JWT = require("jsonwebtoken");

// for requirelogin
const requireLogin = require("../middleware/requireLogin");

// importing keys for JWT secret
const keys = require("../configuration/keys");
const JWTSecret = keys.JWTSecret.mysecret;

// for hasing password
const bcrypt = require("bcryptjs");

//now its time to use mondel
const User = mongoose.model("User");

router.get("/signup", (req, res) => {
    res.send("welcome to signup");
});

router.post("/signup", (req, res) => {
    // destructuring
    const { name, email, username, password } = req.body;
    // checking for empty values
    if (!name || !email || !username || !password) {
        return res.send("please fill all the values");
    } else {
        // checking if we got all from POST request
        // console.log(req.body);

        // checking if username or email already exists in database
        User.findOne({ $or: [{ email: email }, { username: username }] })
            .then((alreadyUser) => {
                if (alreadyUser) {
                    return res.send(
                        "user with that email or username already exists"
                    );
                } else {
                    // before saving user let's hash password
                    bcrypt.hash(password, 18).then((hashedPassword) => {
                        // save user
                        const user = new User({
                            email,
                            username,
                            name,
                            password: hashedPassword,
                        });
                        user.save()
                            .then(() => {
                                return res.send("new user created succesfully");
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

router.get("/login", (req, res) => {
    res.send("welcome to login");
});

router.post("/login", (req, res) => {
    // destructuring email and password
    const { email, password } = req.body;

    // if empty fields
    if (!email || !password) {
        return res.send("please fill up all the field");
    }
    // if fields are not empty
    else {
        // check if user exist
        User.findOne({ email: email })
            // if user exist then saving it to alreadyUser
            .then((alreadyUser) => {
                // if user does not exist
                if (!alreadyUser) {
                    return res.send("User does not exist");
                }
                // if user exists then check for the password
                else {
                    bcrypt
                        .compare(password, alreadyUser.password)
                        // checking password mathces or not
                        .then((doMatch) => {
                            if (doMatch) {
                                // return res.send("logged in succesfully");
                                // adding token after logged in on the basis of user id
                                const token = JWT.sign(
                                    { _id: alreadyUser.id },
                                    JWTSecret
                                );
                                res.json({ token });
                            } else {
                                return res.send("Wrong password");
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

router.get("/protected", requireLogin, (req, res) => {
    res.send("hey i am protected content");
});
module.exports = router;
