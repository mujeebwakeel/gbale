var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Customer = require("../models/customer");
var passport = require("passport");
var middleware = require("../middlewares");


// ROUTE ROUTE
router.get("/", function(req, res){
    res.render("landing");
});


// AUTH ROUTES
router.get("/register", function(req,res){
    res.render("register", {page: 'register'});
});

router.post("/register", middleware.checkEmailRepetition, function(req,res){
             var newUser = new User({username: req.body.username,
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    email: req.body.email,
                                });
    if(req.body.adminCode === process.env.ADMINCODE){
        newUser.isAdmin = true;
    }
   User.register(newUser, req.body.password, function(err,user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req,res,function(){
           req.flash("success", "You are now signed in as " + req.user.username + ". Welcome to Gbale.");
           res.redirect("/home");
       });
     }); 
    });

// LOGIN ROUTES
router.get("/login", function(req,res){
    res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", {
    successFlash: "You are now logged in!",
    successRedirect: "/home",
    failureFlash: true,
    failureRedirect: "/login"
}), function(req,res){
});

// LOG OUT ROUTE
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

var houses = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1502005097973-6a7082348e28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1527030280862-64139fba04ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1568092775154-7fa176a29c0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
]

router.get("/home", function(req,res){
    res.render("home", {page: "home", houses: houses});
});

router.get("/users", function(req,res) {
    User.find({}, function(err, foundUser) {
        res.send(foundUser);
    })
})



module.exports = router;
