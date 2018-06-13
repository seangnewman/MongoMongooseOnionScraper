var bodyParser = require("body-parser");


var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

/* ****************************************************************************
// Middleware
// 
****************************************************************************** */
var db = require("./models");
var express = require("express");
// Initialize Express
var app = express();

var router = require('./controllers/controller.js');
app.use('/', router);
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Express-Handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



 /*
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
       
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
         
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
 
*/

var PORT = process.env.PORT || 3000;
//listen(process.env.PORT || 3000)


// Configure middleware

// Use morgan logger for logging requests
//app.use(logger("dev"));


// Connect to the Mongo DB
// Create a collection to populate the collection//
mongoose.connect("mongodb://localhost/theOnionPopulator");
//mongoose.connect("mongodb://heroku_rdsn9lrh:8jupf52ejk0o85dvho6s5i6ggo@ds229458.mlab.com:29458/heroku_rdsn9lrh");

// Routes

// Import Routes/Controller


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
