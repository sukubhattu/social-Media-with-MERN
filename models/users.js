// first importing mongoose
const mongoose = require("mongoose");

// creating new userSchema Object
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// creating a name to model
mongoose.model("User", userSchema);
// User is name of this model

// i am not exporting this model explicitly
// but i will register this model in index.js and will use only if required
