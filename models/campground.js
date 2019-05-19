var mongoose = require("mongoose");

// Defining schemas
var campgroundSchema = mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id:  {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        // Telling this schema that data objects are associated with Ids
        type: mongoose.Schema.Types.ObjectId,
        // Telling this schema that associated objects are from the database model called "comment"
        ref: "Comment"
    }]
});

// Compiling Campground in schema into a model to add database manipulation methods for future instances of schema
// Campground string passed in is the name of the database collection being used to save instances
module.exports = mongoose.model("Campground", campgroundSchema);