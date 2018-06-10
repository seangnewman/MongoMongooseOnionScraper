var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Direct mongoose to create a Schema for the article
 
var ArticleSchema = new Schema({
  // Capture the headline of the article
  headline: {
    type: String,
    required: true
  },
  // Capture the url of the article
  URL: {
    type: String,
    required: true
  },
// Capture a summary of the article
  summary: {
    type: String,
    required: true
  },
  // Capture the date/time the article was posted
  timestamp: {
    type: String,
    required: true
  },


  // Straight from the activity
  // Associate the note with the Article via the foreign key
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
