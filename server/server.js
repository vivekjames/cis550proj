const express = require('express');
const querystring = require('querystring');
const mysql = require('mysql');

const routes = require('./routes')
const config = require('./config.json')
const request = require('request');
const cors = require('cors');
 
 
const app = express();
/*app.use(cors({
    origin: '*'
}));*/

app.use(cors());

app.get('/testing', function(req, res) {
    res.json({message:'testing good'})
})

app.post('/getToken', function (req, res) {
    var redirect_uri = 'http://localhost:3000/';
        
    console.log(req.query)
    var code = req.query.code || null;
    var state = req.query.state || null;

    request({
        url: 'https://accounts.spotify.com/api/token',
        method: "POST",
        form: {
            code: code,
            redirect_uri: redirect_uri, 
            grant_type: 'authorization_code',
            client_id: '20038c715a704136bd16ff016feeb3b9',
            client_secret: '4301f7a93c17480481f132b6eadc3b52'
        },
        headers: {
            //'Authorization': auth,
            'Content-Type': 'application/x-www-form-urlencoded'
        }, 
        json: true
    }, function (error, response, data) {
        //send the access token back to client
        console.log(data)
        res.send(data);
    });
});

app.post('/addToPlaylistTable', routes.addToPlaylistTable);

app.get('/getUserInput', routes.getUserInput);

// Route 1 - register as GET 
app.get('/analysis/getAvg', routes.getAvg)

// Route 2 - register as GET
app.get('/trends/maxWeeks', routes.maxWeeks)
 
// Route 3 - register as GET
app.get('/trends/avgPeakRankGenre', routes.avgPeakRankGenre)
 
// Route 4 - register as GET
app.get('/trends/songChars', routes.songChars)
 
// Route 5 - register as GET 
app.get('/analysis/userData', routes.userData)
 
// Route 6 - register as GET
app.get('/recs/userinput', routes.recs_userinputs)
 
 
//route 7
app.get('/trends/userpopularTracks', routes.userpopularTracks)
 
 
 
// Route 8 - register as GET
app.get('/recs/degrees', routes.recs_degree)
 
// Route 9 - register as GET
app.get('/recs/charts', routes.recs_charts)

//route 10 - register as GET
app.get('/analysis/topGenre', routes.topGenre)
 
 
 
 
app.listen(config.server_port, () => {
   console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});
 
module.exports = app;