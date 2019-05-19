// Initialise

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    methodOverride  = require("method-override"),
    Comment         = require("./models/comment"),
    User            = require ("./models/user"),
    flash           = require ("connect-flash"),
    seedDB           = require("./seeds");
    
// Requiring Routes    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");


// Connecting mongoose with mongodb by passing the path of mongodb and creating
// a new database for mongoose to use
// mongoose.connect("mongodb://localhost/yelp_camp_v11"); // ---> Use for local development
// Use command line export DATABASEURL=mongodb://localhost/yelp_camp_v11 for defining a local development environment variable on cloud 9
// Better to use a environment variable to define db url instead of harccoded db url which is less secure
// use env variable unless it's not defined in which case fallback is yelp_camp_v11
//Environment variables are great for hiding away sensitive information like passwords and db urls
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v11";
mongoose.connect(url); 

// Telling express to use body-parser
app.use(bodyParser.urlencoded({extended: true}));
// Set default file type to ejs in rendering routes responses
app.set("view engine", "ejs");
// Telling Express to serve files included in the public directory and load them with the application (i.e. css and js files)
// __dirname is a variable that has the main directory path address saved in it as a string (i.e. ~/workspace/YelpCamp/v11)
app.use(express.static(__dirname + "/public"));

// Enable method override for updating and editing campground posts
app.use(methodOverride("_method"));

// Execute connect-flash
app.use(flash());

// seedDB(); // Seed Databse

// PASSPORT CONFIGURATIONS
// Setup express session (require and call at the same time) to hold user session information during the session
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
// Initialise Passport and sessions
app.use(passport.initialize());
app.use(passport.session());
// user.authenticate comes with passport-local-mongoose methods
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passing a variable to all routes to show user logged in status
// This helps with ejs headers to have access currentUser variable
// passport will store logged in user information in this variable. Undefined until a user has logged in.
// Useful for customising what page features to show the user based on if they are logged in or not
app.use(function(req, res, next){
    // Pass current user information to all ejs templates
    res.locals.currentUser = req.user;
    // Pass error / success flash messages to all ejs templates
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    // Allow code excution to continue
    next();
});

// Use the 3 route files that was required above.
app.use(indexRoutes);
// All campground routes should start with "campgrounds"
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// Starting the server
app.listen(process.env.PORT, process.env.IP, function()
{
   console.log("YelpCamp app has started!"); 
});