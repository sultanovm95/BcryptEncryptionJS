//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// updating to LVL 4 const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// Creating connection
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

// creating schema

const userSchema = {
  email: String,
  password: String
};

// creating model
const User = new mongoose.model("User", userSchema);




app.get("/", function(req,res) {
  res.render("home");
});

app.get("/login", function(req,res) {
  res.render("login");
});

app.post("/login", function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result === true) {
            res.render("secrets");
          }
        });

      }
    }
  });
});

app.get("/register", function(req,res) {
  res.render("register");
});

app.post("/register", function(req,res) {

  bcrypt.hash(req.body.password, saltRounds, function(err,hash){
      const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});


app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
