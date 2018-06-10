// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bing = require('bing.search');
var mongo = require('mongodb').MongoClient;
//var bingsearch = new bing({'user':'geckoharbut@gmail.com','password':process.env.psw});
var urlM = require('url');//stands for url module
var searchTerm;
var fabFive = "";
function connectndCollect(mongoUrl){
  mongo.connect(mongoUrl, function(err, client){
     if (err) throw err;
     var db = client.db('searchabs');
     var urlList = db.collection('pasturls');
    urlList.find().sort({_id: 1}).limit(5).toArray(function(err, data){
      for (var i = 0; i < data.length; i++){
        fabFive += data[i];
        return fabFive
      }
    });
  });
}
function insertQuery(mongoUrl, searchTerm){
  mongo.connect(mongoUrl, function(err, client){
     if (err) throw err;
     var db = client.db('searchabs');
     var urlList = db.collection('pasturls');
    urlList.insert(searchTerm);
  });
}


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.use('/api/imgsearch/', function(req, res){
//Image Search
  searchTerm = req.url.substring(1);
  console.log(searchTerm);
  /*bingsearch.search({'query':searchTerm}).then(function(res){
    res.end(res.toString());
    // res is a json object, containing 2 fields:
    // * results: (the array of results)
    // * __next: the url to the next page
}, function(err){ 
    if (err){console.log(err);};
  });*/
  var bingSearch = new bing(process.env.apiKey);
  bingSearch.web(searchTerm, {top: 5}, function(err, results) {
    console.log(results);
  });
  insertQuery('mongodb://process.env.dbu:process.env.dbps@ds229458.mlab.com:29458/searchabs',searchTerm);
});

app.get('/api/latest/', function(req, res){
//Recent Search Queries
  connectndCollect('mongodb://process.env.dbu:process.env.dbps@ds229458.mlab.com:29458/searchabs');
  res.end(fabFive);
  
});




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
