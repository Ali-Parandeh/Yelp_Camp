var express = require ("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROUTES

router.get("/", function(req, res)
{
   res.render("landing"); 
});

// =====================
// AUTH ROUTES
// =====================

// Show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    // Possport local mongoose method register to help with logic
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            // Jump out of this function call if you reach this point
            // and render register form again
            // If user is already registered, this if statement is true.
            // err is an object. a variable of the object is message which contains the actual error message
            req.flash("error", err.message);
            return res.render("register");
        }
        // Authenticate user login information submitted and redirect
        // to campgrounds page after user has logged in
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// Handling login logic using a middleware
// app.post("/login", middleware, callback)
// We can get rid of the call back function (req, res) if need be
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res) {
});

// Logout route logic
router.get("/logout", function(req, res) {
    // logic already given as part of passport that we can just call
    req.logout();
    // Store text "logged you out" in Flash message "success" to be shown in ejs template being loaded next
    // Flash message will be called from the header file
    req.flash("success", "Successfully logged you out");
    // Send user somewhere like home page after logout
    res.redirect("/campgrounds");
});

module.exports = router;