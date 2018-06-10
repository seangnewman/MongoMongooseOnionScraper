var request = require('request');  // Simplified HTTP client
var cheerio = require('cheerio');  // Screen Scraping
var moment = require('moment');

request('https://www.theonion.com/c/news-in-brief', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    //console.log(html);
    var $ = cheerio.load(html);
    $('.entry-title').each(function(i, element){
      



      var a = $(this).children();
      var p = $(this).next().next().children() ;
      var d = $(this).next().children().children().first();

      var articleObj = {
        headline : a.text(),
        URL : a.prop('href'),
        summary : p.text(),
        timestamp : moment(d.prop('datetime')).format('LLL')
      }


       console.log(articleObj);
    });

  }
});