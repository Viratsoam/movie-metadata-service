// Require express
const express = require('express');
const app = express();
const fetch = require('node-fetch');
// Middleware
app.use(express.json());

// search for a file
var path = require('path');
fs=require('fs');
moviesPath = './movies';
sytemfinalJson=[];
var urlFinalJson=[];

// gettting the JSON object 
app.get('/api/movies/:id',(req,res)=>{
    // Searching for the id and imdbId
    var imbid="";
    let fileNames =  fs.readdirSync(moviesPath);
        fileNames.forEach((element)=>{
          let MovieFilePath = path.join(moviesPath, '/', element);
          let rawData = fs.readFileSync(MovieFilePath);
          let data = JSON.parse(rawData);
        //   console.log(req.param.id);
            imbid = data.imdbId;
            if(req.params.id == data.id || req.params.id == data.imdbId){
                // console.log(data);
                sytemfinalJson.push(data);
              return sytemfinalJson;
          }
        });

// console.log(sytemfinalJson);
let url = 'http://www.omdbapi.com/?i='+imbid+'&apikey=68fd98ab&plot=full';
let settings = { method: "Get" };
fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        for (var i = 0; i < sytemfinalJson.length; i++){    
            sytemfinalJson[i].title = json.Title;
            sytemfinalJson[i].description = json.Plot;
            sytemfinalJson[i].duration = json.Runtime;
            sytemfinalJson[i].userrating = json.Ratings;
            sytemfinalJson[i].details = [json.Director,json.Writer,json.Actors];   
        }
        // console.log(json);
        // console.log(sytemfinalJson);
        urlFinalJson.push(sytemfinalJson);

    });
    console.log(urlFinalJson);
});



// PORT
const port = process.env.PORT || 8000;

// listing to the port 
app.listen(port,(err)=>{
    if(err){
        console.log(`Error in listen to the port: ${err} `);
        return;
    }

    console.log(`Server is up on port: ${port}`);
});