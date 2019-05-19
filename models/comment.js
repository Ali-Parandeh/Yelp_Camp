var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
   text: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         // model we're going to refer to with this object id
         ref: "User"
         },
      username: String
   }
});

module.exports = mongoose.model("Comment", commentSchema);