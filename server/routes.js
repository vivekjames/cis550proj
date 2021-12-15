const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');
 

const connection = mysql.createConnection({
   host: config.rds_host,
   user: config.rds_user,
   password: config.rds_password,
   port: config.rds_port,
   database: config.rds_db
});
connection.connect();

// Put the data from the user's playlist into the database
async function addToPlaylistTable(req, res) {
    console.log(req.query.track);
    var track = JSON.parse(req.query.track)
    connection.query('INSERT INTO Playlist VALUES (\'' + track.Artist + '\',\'' + track.Name + '\',\'' + track.TrackId + '\')',
    function (error, results, fields) {
        if(error) {
            console.log(error)
        }
    });
    res.json({message: "createPlaylist done"});
}

// Get the playlist information about the playlist's metadata
async function getUserInput(req, res) {
    connection.query('SELECT * FROM userInput;', function (error, results, fields) {
        if (error) {
            console.log(error)
        } else if (results) {
            return res.json({ results: results })
        }
    })
}

//Route 1
// Gets average attribute of playlist, with the attribute given by the user
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
 
 
// Route 2 
// Gets the maximum time a track from the playlist has spent on the charts, with the name of the track and artist.
async function maxWeeks(req, res) {
  
       connection.query(`
       SELECT C.TrackName, C.TrackArtist, C.WeeksOnBoard
       FROM Charts C, Playlist S
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
 
 
 
// Route 3
// Gets the average Peak Rank on the charts per genre present in the playlist.
async function avgPeakRankGenre(req, res) {
  
   connection.query(`
   WITH TrackGenres as (
       SELECT T.Genre, S.Song, S.Artist
       FROM Tracks T JOIN Playlist S ON T.TrackId = S.TrackID
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
 
// Route 4
// Gets all artists (along with their peak, weeks charted, average energy and danceability) with highly danceable and energetic music (on average) and orders the artists by their average peak rank and weeks on the charts. 
async function songChars(req, res) {
 
   const char1 = req.query.char1 ? req.query.char1 : 'Danceability';
   const char2 = req.query.char1 ? req.query.char1 : 'Energy';
   const threshold1 = req.query.threshold1 ? req.query.threshold1 : '0.5';
   const threshold2 = req.query.threshold2 ? req.query.threshold2 : '0.5';

 
       connection.query(`WITH DanceArtists as (
           select TrackArtist, AVG(PeakRank) as AVGPeak, AVG(WeeksOnBoard) as AVGWeeks, Avg(Danceability) as AVGChar2
           FROM Charts C join Tracks T on C.TrackName = T.TrackName
           WHERE TrackArtist in (SELECT Artist FROM Playlist)
           GROUP BY TrackArtist
           HAVING Avg(${char1}) > ${threshold1}
       ),
       EnergyArtists as (
           select TrackArtist, AVG(PeakRank) as AVGPeak, AVG(WeeksOnBoard) as AVGWeeks, Avg(Energy) as AVGChar1
           FROM Charts C join Tracks T on C.TrackName = T.TrackName
           WHERE TrackArtist in (SELECT Artist FROM Playlist)
           GROUP BY TrackArtist
           HAVING Avg(${char2}) > ${threshold2}
       )
       SELECT D.AVGPeak as AvgPeak, D.AVGWeeks as AvgWeeks, E.AVGChar1 as AvgChar1, D.AVGChar2 as AvgChar2, D.TrackArtist as Artist
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


// Route 5
// Join the user’s personal playlist, represented by UserSongs, with Tracks, in order to find the metadata for each of the songs in this playlist. Stores this in a view called ‘userInput.’
async function userData (req, res){
    connection.query(`CREATE VIEW userInput AS
SELECT p.TrackId as TrackId, t.TrackName, t.ArtistName, t.Genre, t.Acousticness, t.Danceability, t.Energy,
    t.Instrumentalness, t.Liveness, t.Loudness, t.Popularity, t.Speechiness, t.DurationMs, t.TimeSig, t.TrackKey,
    t.TrackMode, t.Valence
FROM Playlist p
JOIN Tracks t
ON p.TrackId = t.TrackId;`, function (error, results, fields){
           if(error){
                console.log("ERROR IN USERDATA")
               console.log(error)
               res.json({error: error})
 
           } else if (results){
               return res.json({results : results})
           }
       });
}
 
// Route 6 
// User selects an energy level (Def: High, Low), genre (Def: Pop), return from Tracks the songs that match this query, that is within the desired years. 
async function recs_userinputs(req, res) {
   const energy = req.query.energy;
   const genre = req.query.genre;
   const acoustic = req.query.acoustic;
   const dance = req.query.dance;
   const min_year = req.query.minyear;
   const max_year = req.query.maxyear;
 
   connection.query(`
   SELECT DISTINCT t1.TrackName as Track, t1.ArtistName as Artist
   FROM
   (SELECT TrackName, TrackId, ArtistName
   FROM Tracks
   WHERE Energy >= ${energy} AND Genre = '${genre}' AND Acousticness >= ${acoustic}
   AND Danceability >= ${dance}) t1
   INNER JOIN
   (SELECT TrackName as Track, TrackArtist as Artist
   FROM Charts
   WHERE Date >= ${min_year} AND Date <= ${max_year}
   ) t2
   ON t1.TrackName = t2.Track AND t1.ArtistName = t2.Artist
   LIMIT 10`, function (error, results, fields) {
 
       if (error) {
           console.log(error)
           res.json({ error: error })
       } else if (results) {
           console.log('hi')
           console.log(results)
           res.json({ results: results })
       }
   });
}
 
// Route 7
// We will find the most popular tracks on the user’s playlist according to whether they were on Billboard’s top charts, then order them by their popularity rating. 
async function userpopularTracks(req, res) {
  
    connection.query(`SELECT DISTINCT Charts1.TrackName as Track, Charts1.TrackArtist as Artist, PeakRank, Popularity
   FROM (SELECT DISTINCT TRACKName, TRACKArtist, MIN(PeakRank) as PeakRank
   FROM Charts
   Group By TRACKName, TRACKArtist
   ) Charts1
   INNER JOIN
   (SELECT TrackName, ArtistName, Popularity
   FROM userInput
   ) usertracks
   ON Charts1.TRACKName = usertracks.TrackName AND Charts1.TRACKArtist = usertracks.ArtistName
   ORDER BY PeakRank;
`, function (error, results, fields) {
      if (error) {
           console.log("hi")
           console.log(error)
           res.json({ error: error })
       } else if (results) {
           console.log("ok")
           console.log(results)
           res.json({ results: results })
       }
   });
}
 
 
// Route 8 
// Given a song, gives songs that have the same energy (1 degree connection), are within .005 energy (2 degree connection) and are within .008 energy (3 degree connection). 
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
                FROM Tracks
                INNER JOIN selected_song ON Tracks.Genre = selected_song.GENRE and Tracks.Energy = selected_song.Energy
                WHERE Tracks.TrackName <> '${track_name}'
            ),
           two_degree(name, id, n, energy, artistname) as (
                SELECT Tracks.TrackName, Tracks.TrackId, 2 as n, Tracks.Energy, Tracks.ArtistName
                FROM Tracks
                INNER JOIN selected_song ON Tracks.Genre = selected_song.GENRE and
                                            Tracks.Energy < selected_song.Energy + 0.005 AND
                                            Tracks.Energy > selected_song.Energy - 0.005
                WHERE Tracks.TrackName <> '${track_name}' AND Tracks.TrackId NOT IN (SELECT id FROM one_degree)   
            ),
           three_degree(name, id, n, energy, artistname) as (
                SELECT Tracks.TrackName, Tracks.TrackId, 3 as n, Tracks.Energy, Tracks.ArtistName
                FROM Tracks
                INNER JOIN selected_song ON Tracks.Genre = selected_song.GENRE and
                                            Tracks.Energy < selected_song.Energy + 0.008 AND
                                            Tracks.Energy > selected_song.Energy - 0.008
                WHERE Tracks.TrackName <> '${track_name}'
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
 
 
// Route 9 
// Returns song names, artists and ranks of songs that are the same genre and were on the Billboard Hot 100 at the same time as the given song/artist 
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
           SELECT DISTINCT billboard_songs.name as Name, billboard_songs.artist as Artist, billboard_songs.trackrank as TrackRank
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

// Route 10 
// Return the most popular genre from the playlist
async function topGenre(req, res) {
    connection.query(`
   SELECT Genre, MAX(mygenre) as TopGenre
FROM (SELECT Genre, COUNT(Genre) mygenre
FROM userInput
GROUP BY Genre
ORDER BY COUNT(Genre) DESC) as g1`
   , function (error, results, fields) {
 
       if (error) {
           console.log(error)
           res.json({ error: error })
       } else if (results) {
           res.json({ results: results })
       }
   });
}

 
 
 
 
 
 
module.exports = {
    addToPlaylistTable,
    getUserInput,
   getAvg, 
   maxWeeks,
   avgPeakRankGenre,
   songChars,
    userData, 
   userpopularTracks,
   recs_userinputs,
   recs_degree,
   recs_charts,
   topGenre


 
}
