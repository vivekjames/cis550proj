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
app.get('/hello', routes.hello)

// Route 2 - register as GET 
app.get('/jersey/:choice', routes.jersey)

// Route 3 - register as GET 
app.get('/matches/:league', routes.all_matches)

// Route 4 - register as GET 
app.get('/players', routes.all_players)

// Route 5 - register as GET 
app.get('/match', routes.match)

// Route 6 - register as GET 
app.get('/player', routes.player)

// Route 7 - register as GET 
app.get('/search/matches', routes.search_matches)

// Route 8 - register as GET 
app.get('/search/players', routes.search_players)





app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;