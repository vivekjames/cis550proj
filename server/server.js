const express = require('express');
const mysql = require('mysql');
 
 
const routes = require('./routes')
const config = require('./config.json')
const cors = require('cors');
 
 
const app = express();
app.use(cors({
   origin: '*'
}));
 
// Route 1 - register as GET 
app.get('/analysis/getAvg', routes.maxWeeks)
 
// Route 2 - register as GET
app.get('/trends/maxWeeks', routes.maxWeeks)
 
// Route 3 - register as GET
app.get('/trends/avgPeakRankGenre', routes.avgPeakRankGenre)
 
// Route 4 - register as GET
app.get('/trends/songChars', routes.songChars)
 
// Route 5 - register as GET 
app.get('/analysis/userData', routes.maxWeeks)
 
// Route 6 - register as GET
app.get('/recs/userinput', routes.recs_userinputs)
 
 
//route 7
app.get('/trends/userpopularTracks', routes.userpopularTracks)
 
 
 
// Route 8 - register as GET
app.get('/recs/degrees', routes.recs_degree)
 
// Route 9 - register as GET
app.get('/recs/charts', routes.recs_charts)
 
 
 
 
app.listen(config.server_port, () => {
   console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});
 
module.exports = app;