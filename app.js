//jshint esversion:6
require('dotenv').config();
const express = require("express");
const parser = require("body-parser");
const ejs= require("ejs");
const mongoose = require("mongoose");
const encrypt= require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(parser.urlencoded({extended: true}));

app.use(express.static("public"));
app.set('view engine','ejs');


mongoose .connect("mongodb://127.0.0.1:27017/userDB");

const userschema= new mongoose.Schema( {
  email: String,
  password:String
});


userschema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User",userschema);


app.get("/",function(req,res)
{
  res.render("home");
});

app.get("/login",function(req,res)
{
  res.render("login");
});

app.get("/register",function(req,res)
{
  res.render("register");
});

app.post("/register",function(req,res)
{
  const user1=new User({
    email: req.body.username,
    password:req.body.password
  });

  user1.save(function(err)
  {
    if(!err)
    {
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  })
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const pass=req.body.password;

  User.findOne({email:username},function(err,founduser){
    if(founduser)
    {
      if(founduser.password === pass)
      {
        res.render("secrets");
      }
    }
    else{
      console.log(err);
    }
  });
});

app.listen(3000, function()
{
  console.log("server started");
});
