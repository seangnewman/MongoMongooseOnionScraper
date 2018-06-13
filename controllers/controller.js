var request = require('request');  // Simplified HTTP client
var express = require("express");
var mongoose = require("mongoose");
var moment = require('moment');
var path = require('path');
var bodyParser = require("body-parser");
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("../models");
// Initialize Express
var router = express.Router();
var app = express();
app.use('/', router);
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Express-Handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


/* ****************************************************************************
// Routes
// Default route, using request as it is required but axiom is 
// my perferred method
****************************************************************************** */
router.get('/', function (request, response) {
  response.redirect('/scrape');   // Scrape the onion
}); // End default action

// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.theonion.com/c/news-in-brief").then(function (response) {

    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Grab evey class of .entry-title
    $('.entry-title').each(function (i, element) {
      var articleObj = {
        headline: $(this).children().text(),
        URL: $(this).children().prop('href'),
        summary: $(this).next().next().children().text(),
        timestamp: moment($(this).next().children().children().first().prop('datetime')).format('LLL')
      }

      // Check the count to see if this headline already exists in database collection
      db.Article.count({ headline: articleObj.headline }, function (error, count) {
        if (count == 0) {
          // Create a new Article using the `articleObj` object built from scraping
          db.Article.create(articleObj)
            .then(function (dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function (err) {
              // If an error occurred, send it to the client
              return res.json(err);
            });
        }
      });
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    //res.send("Scrape Complete");
    res.redirect("/articles");
  });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
  // Grab every document in the Articles collection

  db.Article.find({})
    .exec(function (err, doc) {
      // log any errors
      if (err) {
        console.log(err);
      }
      // or send the doc to the browser as a json object
      else {
        var hbsObject = { articles: doc }
        res.render('index', hbsObject);
        // res.json(hbsObject)
      }
    });

});
/*
// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {

  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

*/
/*
// Route for saving/updating an Article's associated Note
router.post("/add/note/:id", function(req, res) {
  console.log(req.body);
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { Note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      //res.json(dbArticle);
      console.log("success");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      //res.json(err);
      console.log("An error occurred");
    });
  });
*/
/*
// Delete a Note 
router.post("/articles/remove/:id", function (req, res) {

  // Create a new note and pass the req.body to the entry
  db.Note.findByIdAndRemove({ _id: req.params.id }, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      res.sendStatus(200);
    }
  });

*/
 
  router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    console.log("in post");
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

 
//});


// Export app to Server.js
module.exports = router;
