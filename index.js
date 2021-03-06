const express = require("express");
const mongoose = require("mongoose");

//initiliazing application
const app = express();

// for using json
app.use(express.json());

// importing configuration keys
const keys = require("./configuration/keys");

// importing or registering model
require("./models/users");
// to use it
// mongoose.model("User");

// connection with mongoDB
mongoose.connect(keys.mongoDB.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
    console.log("connected to mongoDB succesfully");
});

mongoose.connection.on("error", (err) => {
    console.log("failed to connect to the mongodb", err);
});

// Route goes here
app.get("/", (req, res) => {
    res.send("welcome to the index page");
});

// now turn for auth rotues
app.use("/auth", require("./routes/authentication"));

// for port of my web server
const PORT = process.env.PORT || 8000;

// initializing my web serer
app.listen(PORT, () => {
    console.log("server is running on", PORT);
});
