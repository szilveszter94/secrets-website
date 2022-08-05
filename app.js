//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields: ["password"]});

const User = mongoose.model("user", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.route("/login")

.get(function (req, res) {
    res.render("login");
})

.post(function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function (err, result) {
    if (err) {
      res.send("Error", err);
    } else {
      if (result) {
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

app.route("/register")

.get(function (req, res) {
  res.render("register");
})

.post(function (req, res) {
  if (!User.findOne({email: req.body.username})) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
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



app.get("/submit", function (req, res) {
  res.render("submits");
});

app.listen(3000, function () {
  console.log("Server started at port 3000.");
});
