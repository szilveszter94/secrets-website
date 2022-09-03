//jshint esversion:6


// import required modules
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

// set the ejs app
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// set the database
mongoose.connect("mongodb://localhost:27017/userDB");

// create the nosql database schema
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// use the password encrypt plugin
userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields: ["password"]});

// create mongoose model
const User = mongoose.model("user", userSchema);

// create homepage
app.get("/", function (req, res) {
  res.render("home");
});

// create login route
app.route("/login")

// render the login page
.get(function (req, res) {
    res.render("login");
})

// get the user information
.post(function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  // check the database if user exist
  User.findOne({email: username}, function (err, result) {
    if (err) {
      res.send("Error", err);
    } else {
      if (result) {
        // check the password
        if (result.password === password) {
          res.render("secrets"); }
        else {
          res.send("Wrong password");
        }
        }
      else {
        res.send("Email not found.");
      }
      }
  });

});

// create register route
app.route("/register")

// render register page
.get(function (req, res) {
  res.render("register");
})
// get the user information
.post(function (req, res) {
  // check if email exist
  if (!User.findOne({email: req.body.username})) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    // create new user if email doesn't exist
    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets")
      }
    });
  } else {
    res.send("Email already exists.")
  }

});


// create submits route
app.get("/submit", function (req, res) {
  res.render("submits");
});
// start server
app.listen(3000, function () {
  console.log("Server started at port 3000.");
});
