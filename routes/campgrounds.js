var express = require ("express");
var router  = express.Router();
var Campground = require("../models/campground");
//Express automatically requires the content of any directory that is renamed to "index.js" so no need to say ../middlware/index
var middleware = require ("../middleware");



// INDEX ROUTE - Show all campgrounds
router.get("/", function(req, res)
{
    // Rendering ejs file by pulling data from mongodb campground database via mongoose
    Campground.find({}, function(err, allCampgrounds)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE ROUTE - Add new camground to the database
router.post("/", middleware.isLoggedIn, function(req, res)
{
    // get data from form and add to campgrounds array
    var author = 
    {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = 
    {
        name: req.body.campground.name, 
        image: req.body.campground.image, 
        price: req.body.campground.price, 
        description: req.body.campground.description, 
        author: author
        
    };
    // Create a new campground and save to database
    // Creating an instance of campground and passing in a callback function for error checking
    // Using capital letter for first letter of variable to suggest this is a model object not a variable
    Campground.create(newCampground, function(err, newlyCreated)
    {
       if (err)
       {
           console.log(err);
       }
       else
       {
            // redirect back to campgroudns page
            req.flash("success", "Campground post successfully created!");
            res.redirect("/campgrounds");           
       }
    });
    

});

// NEW - Show from to create new campground
router.get("/new", middleware.isLoggedIn ,function(req, res) {
   res.render("campgrounds/new");
});

// SHOW - Show the specific campground
router.get ("/:id", function(req, res) {
    // Find the campground with the provided ID, populate associated comment ids with comment objects.
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            // Render the show ejs template with that campground
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res)
{
    Campground.findById(req.params.id, function(err, foundCampground)
    {
        if (err)
        {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
        else
        {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // Find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        // redirect somewhere (Showpage)
        else
        {
            // Can also use updatedCampground._id
            // We're redirecting instead of rendering an ejs file 
            //because this is a matter of refreshing the page with the 
            //updated content from the database
            req.flash("success", "Campground post successfully updated!");
            res.redirect("/campgrounds/" + req.params.id); 
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
      if(err)
      {
            res.redirect("/campgrounds"); 
      }
      else
      {
            req.flash("success", "Campground sucessfully deleted!");
            res.redirect("/campgrounds"); 
      }
  });

});

module.exports = router;