// CONFIGURATIONS
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlwareObj = {};

// All middleware goes here
// Can also define middlewareObj using this syntax {checkCampgroundOwnership: function(), etc}

// Is logged in middlware definition
middlwareObj.isLoggedIn = function(req, res, next)
{
    if (req.isAuthenticated()){
        return next();
    }
    // Store this message and information, then show in the next page being loaded
    // Store text "logged you out" in Flash message "success" to be shown in ejs template being loaded next
    // Flash message will be called from the header file
    req.flash("error", "You need to be logged to do that!");
    res.redirect("/login");
};

// Middlware for authenticating and authorising user - ownership of content
middlwareObj.checkCampgroundOwnership = function(req, res, next)
{
// If user is logged in
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err, foundCampground)
        {
            if(err)
            {
                // Take user to back where they came from
                res.redirect("back");
            }
            else 
            {
                // If user owns the campground
                // NOTE: foundCampground.author.id is a mongoose object !== req.user._id which is a string
                if(foundCampground.author.id.equals(req.user._id))
                {
                    // move on to the rest of the code in route function - step outside of middlware
                    next();   
                }
                else 
                {
                    // Take user to back where they came from
                    req.flash("error", "You don`t have permission to do that!");
                    res.redirect("back");
                }

            }
        });
    } 
    else
    {
        // Take user to back where they came from and show them an error message
        req.flash("error", "You need to be logged to do that!");
       res.redirect("back");
    }
};

middlwareObj.checkCommentOwnership = function(req, res, next)
{
// If user is logged in
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err, foundComment)
        {
            if(err)
            {
                // Take user to back where they came from
                res.redirect("back");
            }
            else 
            {
                // If user owns the comment
                // NOTE: foundComment.author.id is a mongoose object !== req.user._id which is a string
                if(foundComment.author.id.equals(req.user._id))
                {
                    // move on to the rest of the code in route function - step outside of middlware
                    next();   
                }
                else 
                {
                    // Take user to back where they came from
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }

            }
        });
    } 
    else
    {
        // Take user to back where they came from and show them the error message
        req.flash("error", "You need to be logged to do that!");
       res.redirect("back");
    }
};

module.exports = middlwareObj;