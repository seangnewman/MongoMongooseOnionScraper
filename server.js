var bodyParser = require("body-parser");
var moment = require('moment');
var mongojs = require("mongojs");
var logger = require("morgan");


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
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Express-Handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


/*
/* ****************************************************************************
// Routes
// Default route, using request as it is required but axiom is 
// my perferred method
****************************************************************************** */

router.get('/', function (request, response) {
  response.redirect('/scrape');   // Scrape the onion
}); // End default action

app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry

  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client

      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection

  db.Article.find({})
    .exec(function (err, doc) {
      // log any errors
      if (err) {
        res.json(err);
      }
      // or send the doc to the browser as a json object
      else {
        var hbsObject = { articles: doc }
        res.render('index', hbsObject);
        //res.json(dbArticle);
        //res.json(hbsObject)

      }
    });

});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log("complete");
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/scrape", function (req, res) {
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

// Delete One from the DB
app.get("/delete/:id", function (req, res) {
  // Remove a note using the objectID
   console.log(mongojs.ObjectID(req.params.id));


   db.Note.findByIdAndRemove(req.params.id, function(error, result ){
     if(error){
       res.send(error);
     }else{
       console.log("deleted");
       res.redirect("/articles");
     }
   });
/*
  db.Note.remove(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    function (error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
       
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
         console.log(removed);
        //res.send(removed);
        res.redirect("/articles");
      }
    });
    */
});
 

var PORT = process.env.PORT || 3000;
//listen(process.env.PORT || 3000)


// Configure middleware

// Use morgan logger for logging requests
//app.use(logger("dev"));


// Connect to the Mongo DB
// Create a collection to populate the collection//
//mongoose.connect("mongodb://localhost/theOnionPopulator");
mongoose.connect("mongodb://heroku_rdsn9lrh:8jupf52ejk0o85dvho6s5i6ggo@ds229458.mlab.com:29458/heroku_rdsn9lrh");

// Routes

// Import Routes/Controller


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
