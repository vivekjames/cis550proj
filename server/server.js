const express = require('express');
const querystring = require('querystring');
const mysql = require('mysql');

const routes = require('./routes')
const config = require('./config.json')
const cors = require('cors');
 
 
const app = express();
/*app.use(cors({
    origin: '*'
}));*/

app.use(cors());

app.get('/testing', function(req, res) {
    res.json({message:'testing good'})
})


app.get('/login', function(req, res) {
    
    var state = "state";
    
    var scope = "playlist-read-public playlist-read-private";

    const clientID = "20038c715a704136bd16ff016feeb3b9";
    const redirect_uri = "http://localhost:3000/analysis/";
    //res.json({ message: 'in login' });
    res.redirect('https://accounts.spotify.com/authorize?response_type=code&client_id=20038c715a704136bd16ff016feeb3b9&scope=playlist-read-private&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fanalysis%2F&state=asdfghjklzxcvbnm');
})

app.get('/callback', function (req, res) {

    var code = req.query.code || null;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };
});

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