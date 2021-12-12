import config from './config.json'
 
//Route 1
const getAvg = async (attribute) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/analysis/getAvg?page=${attribute}`, {
       method: 'GET',
   })
   return res.json()
}
 
//route 2
const getmaxWeeks = async () => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/trends/maxWeeks`, {
       method: 'GET',
   })
   return res.json()
}
 
//route 3
const getavgPeakRankGenre = async () => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/trends/avgPeakRankGenre`, {
       method: 'GET',
   })
   return res.json()
}
 
//route 4
const getSongChars = async (char1, char2, threshold1, threshold2) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/trends/songChars?char1=${char1}&char2=${char2}&threshold1=${threshold1}&threshold2=${threshold2}`, {
       method: 'GET',
   })
   return res.json()
}
 
const test = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/testing`, {
        method: 'GET',
    })
    return res.json()
}

const login = async () => {
    console.log("IN FETCHER")
    var res = await fetch(`http://${config.server_host}:${config.server_port}/login`, {
        method: 'GET',
    })
    return res.json()
}

//route 5
const getUserData = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/analysis/userData`, {
        method: 'GET',
    })
    return res.json()
 }
 
 
 
 
//Route 6
const getRecsUserInput = async (energy, genre, acoustic, dance, minyear, maxyear) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/recs/userinput?energy=${energy}&
   genre=${genre}&acoustic=${acoustic}&dance=${dance}&minyear=${minyear}&maxyear=${maxyear}`, {
       method: 'GET',
   })
   return res.json()
}
 
 
//route 7 
const userpopularTracks = async () => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/trends/userpopularTracks`, {
       method: 'GET',
   })
   return res.json()
}
 
 
//Route 8
const getRecsDegrees = async (trackname, artistname) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/recs/degrees?trackname=${trackname}&
   artistname=${artistname}`, {
       method: 'GET',
   })
   return res.json()
}
 
 
//Route 9
const getRecsCharts = async (trackname, artistname) => {
   var res = await fetch(`http://${config.server_host}:${config.server_port}/recs/charts?trackname=${trackname}&
   artistname=${artistname}`, {
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
    login,
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
