var express = require ("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//Express automatically requires the content of any directory that is renamed to "index.js" so no need to say ../middlware/index
var middleware = require ("../middleware");


// ======================
// COMMENTS ROUTES
// ======================
// isLoggedIn middleware (defined below) will check if user is logged in before
// allowing the user to make a new comment (before callback is run)

// COMMENTS NEW
router.get("/new", middleware.isLoggedIn ,function(req, res)
{
    // Find campground by Id
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new", {campground: campground});
        }
    });
});

// isLoggedIn middleware (defined below) will check if user is logged in before
// allowing the user to make a new comment using post route directlty (postman)

// SUBMIT FORM ROUTE
router.post("/", middleware.isLoggedIn ,function(req, res)
{
   // Look up campground using ID
   Campground.findById(req.params.id, function(err, campground)
   {
      if(err)
      {
          console.log(err);
          req.flash("error", "Something went wrong!");
          res.redirect("/campgrounds");
      }
      else
      {
          // Create a new comment
        Comment.create(req.body.comment, function(err, comment)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                // Add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                // Connect the comment to campground and show comments on show page
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Comment successfully added");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
      }
   });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res)
{
    Comment.findById(req.params.comment_id, function(err, foundComment)
    {
        if (err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
        }
    });
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res)
{
    // Find and update correct comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err)
        {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
        // redirect somewhere (Showpage)
        else
        {
            // Can also use updatedCampground._id
            // We're redirecting instead of rendering an ejs file 
            //because this is a matter of refreshing the page with the 
            //updated content from the database
            req.flash("success", "Comment successfully updated!");
            res.redirect("/campgrounds/" + req.params.id); 
        }
    });
});

// COMMENTS DESTROY ROUTE
// Note: Make sure to include ":" before id or comment_id, otherwise your route will not work.
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res)
{
    // findByIdAndRemove()
    Comment.findByIdAndRemove(req.params.comment_id, function(err)
    {
       if(err)
       {
           req.flash("error", "Something went wrong!");
           res.redirect("back");
       }
       else
       {
           // Send us back to campground show page
           req.flash("success", "Comment successfully deleted!");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});


module.exports = router;