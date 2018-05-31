var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require('express-handlebars');
var request = require('request')

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home');
});
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  mongoose.connect(MONGODB_URI);
  request("https://www.fark.com/", function (error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);


    // An empty array to save the data that we'll scrape


    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $('.headlineText').children().each(function (i, element) {


      var link = $(element).children().attr("href");


      var title = $(element).children().text();
      var results = [];
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: link
      });
      console.log(results);
      // Create a new Article using the `result` object built from scraping
      db.Article.create(results)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
  });


  // If we were able to successfully scrape and save an Article, send a message to the client
  res.send("Scrape Complete");
});


// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(function (dbArticle) {
      // If all Users are successfully found, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({
    _id: req.params.id
  })
    // Specify that we want to populate the retrieved users with any associated notes
    .populate("note")
    .then(function (dbArticle) {
      // If able to successfully find and associate all Users and Notes, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });

});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, { notes: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If the User was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });

});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
