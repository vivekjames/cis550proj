import config from './config.json'


const test = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/testing`, {
        method: 'GET',
    })
    return res.json()
}

// Get the Spotify Authorization Token
const getToken = async (code) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/getToken?code=${code}`, {
        method: 'POST',
    })
    return res.json()
}

// Add user input playlist to the database
const addToPlaylistTable = async (track) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/addToPlaylistTable?track=${track}`, {
        method: 'POST',
    })
    return res.json()
}

// Get the user inputted playlist
const getUserInput = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/getUserInput`, {
        method: 'GET',
    })
    return res.json()
}
 
//Route 1
const getAvg = async (attribute) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/analysis/getAvg?page=${attribute}`, {
       method: 'GET',
   })
   return res.json()
}
 
//Route 2
const getmaxWeeks = async () => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/trends/maxWeeks`, {
       method: 'GET',
   })
   return res.json()
}
 
//Route 3
const getavgPeakRankGenre = async () => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/trends/avgPeakRankGenre`, {
       method: 'GET',
   })
   return res.json()
}
 
//Route 4
const getSongChars = async (char1, char2, threshold1, threshold2) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/trends/songChars?char1=${char1}&char2=${char2}&threshold1=${threshold1}&threshold2=${threshold2}`, {
       method: 'GET',
   })
   return res.json()
}

//Route 5
const getUserData = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/analysis/userData`, {
        method: 'GET',
    })
    return res.json()
 }
 
 
 
 
//Route 6
const getRecsUserInput = async (energy, genre, acoustic, dance, minyear, maxyear) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/recs/userinput?energy=${energy}&genre=${genre}&acoustic=${acoustic}&dance=${dance}&minyear=${minyear}&maxyear=${maxyear}`, {
       method: 'GET',
   })
   return res.json()
}
 
 
//Route 7 
const userpopularTracks = async () => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/trends/userpopularTracks`, {
       method: 'GET',
   })
   return res.json()
}
 
 
//Route 8
const getRecsDegrees = async (trackname, artistname) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/recs/degrees?trackname=${trackname}&artistname=${artistname}`, {
       method: 'GET',
   })
   return res.json()
}
 
 
//Route 9
const getRecsCharts = async (trackname, artistname) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/recs/charts?trackname=${trackname}&artistname=${artistname}`, {
       method: 'GET',
   })
   return res.json()
}

//Route 10
const getTopGenre = async () => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/analysis/topGenre`, {
       method: 'GET',
   })
   return res.json()
}
 
 
 
 
 
 
 
 
 
export {
    test,
    getToken,
    addToPlaylistTable,
    getUserInput,
    getAvg,
    getUserData, 
   getmaxWeeks, 
   getavgPeakRankGenre,
   getRecsUserInput,
   getRecsDegrees,
   getRecsCharts,
   userpopularTracks,
   getSongChars, 
   getTopGenre
}
