// A seeding script used to feed the database with dummy data for testing. 

var mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment");
    
    
var data = [
    {
        name: "Cloud's rest",
        image: "http://campbaboon.co.uk/wp-content/uploads/2017/07/Carousel-Home-Camp.jpg",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    },
    {
        name: "Desert's Mesia",
        image: "https://images.campsites.co.uk/post/10592/7fa10a33-1cae-4d87-bedb-0b7be1114394/840/560/either/camping-for-beginners.jpg",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    },
    {
        name: "Canyon Floor",
        image: "https://www.planetware.com/photos-large/USUT/utah-zion-national-park-camping-south-campground.jpg",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    }
];
    
function seedDb()
{
    // Remove every data from the database in campgrounds collection then seed it with new data
    Campground.remove({}, function(err)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Removed campgrounds");
            
            Comment.remove({}, function (err) 
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("Removed Comments")
                }
            });
    
            // Add a few campground from the data array to seed the database with some data
            data.forEach(function(seed)
            {
                Campground.create(seed, function(err, data)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    
                    else
                    {
                        console.log("Added a campground");
                    }
                
                    // Add a few comments to each campground entries
                    Comment.create({
                        text: "This place is great but I wish I had internet",
                        author: "Homer"
                    }, function(err, comment)
                        { 
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                data.comments.push(comment);
                                data.save();
                                console.log("Created new comment");
                            }
                        }
                    );
                });
            });
        }
    });
}

// Exporting as seedDB() will run the function automatically when required in app.js
module.export = seedDb;