import React from 'react';

import MenuBar from '../components/MenuBar';

import { addToPlaylistTable, getUserData, getUserInput, getAvg, getTopGenre} from '../fetcher'


class AnalysisPage extends React.Component {
    constructor(props) {
        super(props)

        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('playlist'))
        console.log(urlParams.get('accessToken'))
        this.state = {
            playlistID: urlParams.get('playlist'),
            playlist: [],
            accessToken: urlParams.get('accessToken'),
            playlistMetaData: [],
            topGenre: '',
            pop: [],
            acous: [],
            dance: [],
            energy: [],
            instr: [],
            live: [],
        }
    }

    componentDidMount() {
        this.getSongs();
    }

    //https://open.spotify.com/playlist/61YIZmXlbTDSasXwv4GNhG?si=ed6a4e31874842a5

    getSongs() {
        var apiCall = 'https://api.spotify.com/v1/playlists/' + this.state.playlistID + '/tracks'
        fetch(apiCall, {
            headers: {
                'Authorization': 'Bearer ' + this.state.accessToken
            }
        }).then((results) => {
            results.json().then((playlist) => {
                if (typeof playlist.items === 'undefined') {
                    getUserInput().then(res => {
                        console.log("got userInput");
                        console.log(res);
                        var ids = [];
                        for (let count = 0; count < res.results.length; count++) {
                            var index = ids.indexOf(res.results[count].TrackId)
                            if (index == -1) {
                                ids.push(res.results[count].TrackId);
                            } else {
                                res.results[index].Genre = res.results[index].Genre + ', ' + res.results[count].Genre;
                                res.results.splice(count, 1);
                                count--;
                            }
                        }
                        this.setState({ playlistMetaData: res.results });
                        this.setMeta(res);
                    })
                    /*alert("Playlist could not be loaded");
                    window.location = `/`;*/

                } else {
                    var cleanedPlaylist = playlist.items.map((song) => {
                        return {
                            Artist: song.track.artists[0].name.replace('&', 'and').replace('\'', '').replace('\"', '').replace('\\', ''),
                            Name: song.track.name.replace('&', 'and').replace('\'', '').replace('\"', '').replace('\\', ''),
                            TrackId: song.track.id
                        }
                    })
                    console.log(cleanedPlaylist)
                    this.setState({ playlist: cleanedPlaylist})

                    // TODO uncomment for loop and getUserData()

                    for (var count = 0; count < cleanedPlaylist.length; count++) {
                        addToPlaylistTable(JSON.stringify(cleanedPlaylist[count])).then(res => {
                            console.log("added " + count);
                            console.log(res);
                        })
                    }
                    getUserData().then(res => {
                        console.log("created userInput");
                        console.log(res);
                    })
                    getUserInput().then(res => {
                        console.log("got userInput");
                        console.log(res);
                        var ids = [];
                        for (let count = 0; count < res.results.length; count++) {
                            var index = ids.indexOf(res.results[count].TrackId)
                            if (index == -1) {
                                ids.push(res.results[count].TrackId);
                            } else {
                                res.results[index].Genre = res.results[index].Genre + ', ' + res.results[count].Genre;
                                res.results.splice(count, 1);
                                count--;
                            }
                        }
                        this.setState({ playlistMetaData: res.results });
                        this.setMeta(res);
                    })
                }
                
            })
        })
    }

    setMeta(res) {
        getTopGenre().then(res => {
            console.log(res);
            this.setState({ topGenre: res.results[0].Genre })
        })

        var numSongs = res.results.length;

        var avg = parseInt(res.results.reduce((total, next) => total + next.Popularity, 0) / numSongs, 10);
        var min = res.results.reduce((min, next) => min.Popularity < next.Popularity ? min : next, 1000).Popularity;
        var max = res.results.reduce((max, next) => max.Popularity > next.Popularity ? max : next, 0).Popularity;
        this.setState({ pop: [avg, min, max] })

        avg = Math.floor(res.results.reduce((total, next) => total + next.Acousticness, 0) / numSongs * 1000) / 1000;
        min = res.results.reduce((min, next) => min.Acousticness < next.Acousticness ? min : next, 1000).Acousticness;
        max = res.results.reduce((max, next) => max.Acousticness > next.Acousticness ? max : next, 0).Acousticness;
        this.setState({ acous: [avg, min, max] })

        avg = Math.floor(res.results.reduce((total, next) => total + next.Danceability, 0) / numSongs * 1000) / 1000;
        min = res.results.reduce((min, next) => min.Danceability < next.Danceability ? min : next, 1000).Danceability;
        max = res.results.reduce((max, next) => max.Danceability > next.Danceability ? max : next, 0).Danceability;
        this.setState({ dance: [avg, min, max] })

        avg = Math.floor(res.results.reduce((total, next) => total + next.Energy, 0) / numSongs * 1000) / 1000;
        min = res.results.reduce((min, next) => min.Energy < next.Energy ? min : next, 1000).Energy;
        max = res.results.reduce((max, next) => max.Energy > next.Energy ? max : next, 0).Energy;
        this.setState({ energy: [avg, min, max] })

        avg = Math.floor(res.results.reduce((total, next) => total + next.Instrumentalness, 0) / numSongs * 1000000) / 1000000;
        min = res.results.reduce((min, next) => min.Instrumentalness < next.Instrumentalness ? min : next, 1000).Instrumentalness;
        max = res.results.reduce((max, next) => max.Instrumentalness > next.Instrumentalness ? max : next, 0).Instrumentalness;
        this.setState({ instr: [avg, min, max] })

        avg = Math.floor(res.results.reduce((total, next) => total + next.Liveness, 0) / numSongs * 1000) / 1000;
        min = res.results.reduce((min, next) => min.Liveness < next.Liveness ? min : next, 1000).Liveness;
        max = res.results.reduce((max, next) => max.Liveness > next.Liveness ? max : next, 0).Liveness;
        this.setState({ live: [avg, min, max] })
    }

    render() {
        const headerStyle = {
            fontWeight: 'bold',
            textAlign: 'center'
        }

        const avgStyle = {
            textAlign: 'center'
        }

        const mStyle = {
            textAlign: 'center'
        }

        const divStyle= {
            marginLeft: 40
        }

        return (
            <div style={{alignContent: 'center'}}>
                {/* TODO add props to MenuBar */}
                <MenuBar playlist={this.state.playlistID} accessToken={this.state.accessToken}/> 
                <div style={{marginTop: 20, marginLeft: 20}}>
                    <h3> Analysis </h3>
                    <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center', marginTop: 40}}>

                        <div>
                            <h4 style={headerStyle}> Top Genre </h4>
                            <h5 style={avgStyle}> {this.state.topGenre} </h5>
                            
                        </div>

                        <div style={divStyle}>
                            <h4 style={headerStyle}> Popularity </h4>
                            <h5 style={avgStyle}> Avg: {this.state.pop[0]} </h5>
                            <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                <h6>Min: {this.state.pop[1]}</h6>
                                <h6>Max: {this.state.pop[2]}</h6>
                            </div>
                        </div>

                        <div style={divStyle}>
                            <h4 style={headerStyle}> Acousticness </h4>
                            <h5 style={avgStyle}> {this.state.acous[0]} </h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <h6>{this.state.acous[1]}</h6>
                                <h6>{this.state.acous[2]}</h6>
                            </div>
                        </div>

                        <div style={divStyle}>
                            <h4 style={headerStyle}> Danceability </h4>
                            <h5 style={avgStyle}> {this.state.dance[0]} </h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <h6>{this.state.dance[1]}</h6>
                                <h6>{this.state.dance[2]}</h6>
                            </div>
                        </div>

                        <div style={{width: 150, marginLeft: 40}}>
                            <h4 style={headerStyle}> Energy </h4>
                            <h5 style={avgStyle}> {this.state.energy[0]} </h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <h6>{this.state.energy[1]}</h6>
                                <h6>{this.state.energy[2]}</h6>
                            </div>
                        </div>

                        <div style={divStyle}>
                            <h4 style={headerStyle}> Instrumentalness </h4>
                            <h5 style={avgStyle}> {this.state.instr[0]} </h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <h6>{this.state.instr[1]}</h6>
                                <h6>{this.state.instr[2]}</h6>
                            </div>
                        </div>

                        <div style={divStyle}>
                            <h4 style={headerStyle}> Liveness </h4>
                            <h5 style={avgStyle}> {this.state.live[0]} </h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <h6>{this.state.live[1]}</h6>
                                <h6>{this.state.live[2]}</h6>
                            </div>
                        </div>
                        
                    </div>
                    <table style={{marginTop: 40, width: '100%'}}>
                        <thead>
                            <tr>
                                <th>Artist</th>
                                <th>Name</th>
                                <th>Track ID</th>
                                <th>Duration</th>
                                <th>Genre</th>
                                <th>Popularity</th>
                                <th>Acousticness</th>
                                <th>Danceability</th>
                                <th>Energy</th>
                                <th>Instrumentalness</th>
                                <th>Liveness</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.playlistMetaData.map(item => {
                                return (
                                    <tr key={item.TrackId}>
                                        <td>{item.ArtistName}</td>
                                        <td>{item.TrackName}</td>
                                        <td>{item.TrackId}</td>
                                        <td>{parseInt(parseInt(item.DurationMs) / 60000, 10) + ':' + parseInt(parseInt(item.DurationMs) % 60000 / 1000, 10)}</td>
                                        <td>{item.Genre}</td>
                                        <td>{item.Popularity}</td>
                                        <td>{item.Acousticness}</td>
                                        <td>{item.Danceability}</td>
                                        <td>{item.Energy}</td>
                                        <td>{item.Instrumentalness}</td>
                                        <td>{item.Liveness}</td>
                                        
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default AnalysisPage
