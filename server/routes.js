const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');
 
// TODO: fill in your connection details here
const connection = mysql.createConnection({
   host: config.rds_host,
   user: config.rds_user,
   password: config.rds_password,
   port: config.rds_port,
   database: config.rds_db
});
connection.connect();
 
//Route 1
async function getAvg(req, res){
    const attrb = req.query.attribute
    connection.query('SELECT AVG(${attrb}) AS avg, MIN(${attrb}) as min, MAX(${attrb}) as max FROM userInput;',
    function (error, results, fields){
        if(error) {
            console.log(error)
        } else if (results){
            res.json({results: results})
        }
    });
 }
 
 
 
// Route 2 (handler)
async function maxWeeks(req, res) {
  
       connection.query(`
       SELECT C.TrackName, C.TrackArtist, C.WeeksOnBoard
       FROM Charts C, SamplePlaylist S
       WHERE C.TrackName = S.Song
       AND C.TrackArtist = S.Artist
       ORDER BY WeeksOnBoard DESC LIMIT 1;`
       , function (error, results, fields) {
 
           if (error) {
               console.log(error)
               res.json({ error: error })
           } else if (results) {
               res.json({ results: results })
           }
       });
}
 
 
 
//route 3
 
async function avgPeakRankGenre(req, res) {
  
   connection.query(`
   WITH TrackGenres as (
       SELECT T.Genre, S.Song, S.Artist
       FROM Tracks T JOIN SamplePlaylist S ON T.TrackId = S.TrackId
   )
   SELECT AVG(PeakRank) as AvgPeakRank, Genre
   FROM Charts C, TrackGenres T
   WHERE C.TrackName = T.Song AND C.TrackArtist = T.Artist
   GROUP BY Genre
   ORDER BY AVG(PeakRank) ASC;`
   , function (error, results, fields) {
 
       if (error) {
           console.log(error)
           res.json({ error: error })
       } else if (results) {
           res.json({ results: results })
       }
   });
}
 
//route 4
async function songChars(req, res) {
 
   const char1 = req.query.char1 ? req.query.char1 : 'Danceability';
   const char2 = req.query.char1 ? req.query.char1 : 'Energy';
   const threshold1 = req.query.threshold1 ? req.query.threshold1 : '0.5';
   const threshold2 = req.query.threshold2 ? req.query.threshold2 : '0.5';
 
 
 
 
       connection.query(`WITH DanceArtists as (
           select TrackArtist, AVG(PeakRank) as AVGPeak, AVG(WeeksOnBoard) as AVGWeeks, Avg(Danceability) as AVGChar2
           FROM Charts C join Tracks T on C.TrackName = T.TrackName
           WHERE TrackArtist in (SELECT Artist FROM SamplePlaylist)
           GROUP BY TrackArtist
           HAVING Avg(${char1}) > ${threshold1}
       ),
       EnergyArtists as (
           select TrackArtist, AVG(PeakRank) as AVGPeak, AVG(WeeksOnBoard) as AVGWeeks, Avg(Energy) as AVGChar1
           FROM Charts C join Tracks T on C.TrackName = T.TrackName
           WHERE TrackArtist in (SELECT Artist FROM SamplePlaylist)
           GROUP BY TrackArtist
           HAVING Avg(${char2}) > ${threshold2}
       )
       SELECT D.AVGPeak, D.AVGWeeks, E.AVGChar1, D.AVGChar2, D.TrackArtist
       FROM DanceArtists D JOIN EnergyArtists E ON D.TrackArtist = E.TrackArtist
       GROUP BY D.TrackArtist
       ORDER BY D.AVGPeak ASC, D.AVGWeeks DESC;`, function (error, results, fields) {
 
           if (error) {
               console.log(error)
               res.json({ error: error })
           } else if (results) {
               res.json({ results: results })
           }
       });
 
  
}
 
//Route 5
async function userData (req, res){
   connection.query(`CREATE VIEW userInput AS
       SELECT *
       FROM UserSongs
       JOIN Tracks
       ON UserSongs.TrackId = Tracks.TrackId;`, function (error, results, fields){
           if(error){
               console.log(error)
               res.json({error: error})
 
           } else if (results){
               res.json({results : results})
           }
       });
}
 
// Route 6 (handler)
async function recs_userinputs(req, res) {
   const energy = req.query.energy;
   const genre = req.query.genre;
   const acoustic = req.query.acoustic;
   const dance = req.query.dance;
   const min_year = req.query.minyear;
   const max_year = req.query.maxyear;
 
   connection.query(`
   SELECT DISTINCT t1.TrackName, t1.ArtistName
   FROM
   (SELECT TrackName, TrackId, ArtistName
   FROM Tracks
   WHERE Energy >= ${energy} AND Genre = '${genre}' AND Acousticness >= ${acoustic}
   AND Danceability >= ${dance}) t1
   INNER JOIN
   (SELECT TrackName, TrackArtist
   FROM Charts
   WHERE Date >= ${min_year} AND Date <= ${max_year}
   ) t2
   ON t1.TrackName = t2.TrackName AND t1.ArtistName = t2.TrackArtist
   LIMIT 10`, function (error, results, fields) {
 
       if (error) {
           console.log(error)
           res.json({ error: error })
       } else if (results) {
           res.json({ results: results })
       }
   });
}
 
//route 7
 
async function userpopularTracks(req, res) {
  
   connection.query(`
   SELECT Charts1.TrackName as Track, Charts1.TrackArtist as Artist, PeakRank, Popularity
  FROM (SELECT DISTINCT TRACKName, TRACKArtist, MIN(PeakRank) as PeakRank
  FROM Charts
  Group By TRACKName, TRACKArtist
  ) Charts1
  INNER JOIN
  (SELECT TrackName, ArtistName, Popularity
  FROM userInput
  ) usertracks
  ON Charts1.TRACKName = usertracks.TrackName AND Charts1.TRACKArtist = usertracks.ArtistName
  ORDER BY PeakRank;`
   , function (error, results, fields) {
 
       if (error) {
           console.log(error)
           res.json({ error: error })
       } else if (results) {
           res.json({ results: results })
       }
   });
}
 
 
// Route 8 (handler)
async function recs_degree(req, res) {
  
   const track_name = req.query.trackname
   const artist_name = req.query.artistname
   connection.query(`
       WITH selected_song as (
       SELECT TrackId, Energy, Genre
           FROM Tracks
           WHERE Tracks.TrackName = '${track_name}' and Tracks.ArtistName = '${artist_name}'),
            one_degree(name, id, n, energy, artistname) as (
                SELECT Tracks.TrackName, Tracks.TrackId, 1 as n, Tracks.Energy, Tracks.ArtistName
                FROM Tracks, selected_song
                WHERE Tracks.Genre = selected_song.GENRE AND Tracks.TrackName <> '${track_name}' AND Tracks.Energy = selected_song.Energy
            ),
           two_degree(name, id, n, energy, artistname) as (
              SELECT Tracks.TrackName, Tracks.TrackId, 2 as n, Tracks.Energy, Tracks.ArtistName
                FROM Tracks, selected_song
                WHERE Tracks.Genre = selected_song.GENRE AND Tracks.TrackName <> '${track_name}' AND
                      Tracks.Energy < selected_song.Energy + 0.005 AND Tracks.Energy > selected_song.Energy - 0.005
                       AND Tracks.TrackId NOT IN (SELECT id FROM one_degree)
            ),
           three_degree(name, id, n, energy, artistname) as (
                SELECT Tracks.TrackName, Tracks.TrackId, 3 as n, Tracks.Energy, Tracks.ArtistName
                FROM Tracks, selected_song
                WHERE Tracks.Genre = selected_song.GENRE AND Tracks.TrackName <> '${track_name}' AND
                      Tracks.Energy < selected_song.Energy + 0.008 AND Tracks.Energy > selected_song.Energy - 0.008
                       AND Tracks.TrackId NOT IN (SELECT id FROM one_degree)
                       AND Tracks.TrackId NOT IN (SELECT id FROM two_degree)
            )
           SELECT artistname, name, id, n, energy
           FROM one_degree
           UNION
           SELECT artistname, name, id, n, energy
           FROM two_degree
           UNION
           SELECT artistname, name, id, n, energy
           FROM three_degree
           ORDER BY n ASC;`, function (error, results, fields) {
 
       if (error) {
           console.log(error)
           res.json({ error: error })
       } else if (results) {
           res.json({ results: results })
       }
   });
}
 
 
// Route 9 (handler)
async function recs_charts(req, res) {
  
   const track_name = req.query.trackname
   const artist_name = req.query.artistname
   connection.query(`
   WITH selected_song as (
       SELECT Genre
           FROM Tracks
           WHERE Tracks.TrackName = '${track_name}' and Tracks.ArtistName = '${artist_name}'),
           billboard_date(date) as (
               SELECT Charts.Date
               FROM Charts
               WHERE Charts.TrackName = '${track_name}' and Charts.TrackArtist = '${artist_name}'
               ORDER BY Charts.Date ASC
               LIMIT 1
           ),
           billboard_songs(name, artist, trackrank) as (
               SELECT Charts.TrackName, Charts.TrackArtist, Charts.TrackRank
               FROM Charts, billboard_date
               WHERE Charts.Date = billboard_date.date
           )
           SELECT DISTINCT billboard_songs.name, billboard_songs.artist, billboard_songs.trackrank
           FROM Tracks
           JOIN billboard_songs ON billboard_songs.name = Tracks.TrackName AND billboard_songs.artist = Tracks.ArtistName
           JOIN selected_song ON Tracks.Genre = selected_song.Genre
           ORDER BY billboard_songs.trackrank ASC;`, function (error, results, fields) {
 
       if (error) {
           console.log(error)
           res.json({ error: error })
       } else if (results) {
           res.json({ results: results })
       }
   });
}
 
 
 
 
 
 
module.exports = {
getAvg, 
   maxWeeks,
   avgPeakRankGenre,
   songChars,
    userData, 
   userpopularTracks,
   recs_userinputs,
   recs_degree,
   recs_charts,


 
}
