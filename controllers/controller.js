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

/*
Complete fail.... Placed all routing in the server.js
*/
module.exports = router;
