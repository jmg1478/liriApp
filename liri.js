require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var value = process.argv[3];



switch (command) {
    case "concert-this":
        concertThis(value);
        break;
    case "spotify-this-song":
        spotifySong(value);
        break;
    case "movie-this":
        movieThis(value);
        break;
    case "do-what-it-says":
        doThis(value);
        break;
};

function concertThis(value) {
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
    .then(function(response) {    
        for (var i = 0; i < response.data.length; i++) {

            var datetime = response.data[i].datetime; 

            var concertResults = 
                "\n--------------------------------------------------------------------" +
                    "\n Venue Name: " + response.data[i].venue.name + 
                    "\n Venue Location: " + response.data[i].venue.city +
                    "\n Date of the Event: " + moment(datetime).format("MM-DD-YYYY");
            console.log(concertResults);
            appendLog(concertResults);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
        

}

function spotifySong(value) {
    if(!value){
        value = "moonshiner";
    }
    spotify
    .search({ type: 'track', query: value })
    .then(function(response) {
        for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                "--------------------------------------------------------------------" +
                    "\n Artist(s): " + response.tracks.items[i].artists[0].name + 
                    "\n Song Name: " + response.tracks.items[i].name +
                    "\n Album Name: " + response.tracks.items[i].album.name +
                    "\n Preview Link: " + response.tracks.items[i].preview_url;
                    
            console.log(spotifyResults);
            appendLog(spotifyResults);
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}

function movieThis(value) {
    if(!value){
        value = "young guns";
    }
    // 
    axios.get("https://www.omdbapi.com/?i=" + value + "&apikey=af70a92a")
    .then(function(response) {
        // loop for tomatoes rating
                

            var movieResults = 
                "--------------------------------------------------------------------" +
                    "\nMovie Title: " + response.data.Title + 
                    "\nYear of Release: " + response.data.Year +
                    "\nIMDB Rating: " + response.data.imdbRating +
                    // "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                    "\nCountry Produced: " + response.data.Country +
                    "\nLanguage: " + response.data.Language +
                    "\nPlot: " + response.data.Plot +
                    "\nActors/Actresses: " + response.data.Actors;
            console.log(movieResults);
            appendLog(movieResults);
    })
    .catch(function (error) {
        console.log(error);
    });


    
}


function doThis(value) {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',');
        spotifySong(dataArr);
    })
}
 function appendLog(text){
    fs.appendFile("log.txt", text, function(err) {
        if (err) {
          console.log(err);
        }
      });

 }