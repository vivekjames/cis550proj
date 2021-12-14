import React from 'react';

import MenuBar from '../components/MenuBar';

import { addToPlaylistTable, getUserData, getUserInput, getAvg} from '../fetcher'


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
            popGenre: '',
            pop: [],
            avgAcous: '',
            avgDance: '',
            avgEnergy: '',
            avgInstr: '',
            avgLive: '',
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
                console.log(playlist.items);
                var cleanedPlaylist = playlist.items.map((song) => {
                    return {
                        Artist: song.track.artists[0].name.replace('&', 'and'),
                        Name: song.track.name.replace('&', 'and'),
                        TrackId: song.track.id
                    }
                })
                console.log(cleanedPlaylist)
                this.setState({ playlist: cleanedPlaylist})
                // for (var count = 0; count < cleanedPlaylist.length; count++) {
                //     addToPlaylistTable(JSON.stringify(cleanedPlaylist[count])).then(res => {
                //         console.log("added " + count);
                //         console.log(res);
                //     })
                // }
                getUserData().then(res => {
                    console.log("created userInput");
                    console.log(res);
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
                                count --;
                            }
                        }
                        this.setState({playlistMetaData: res.results});

                        var numSongs = res.results.length;

                        var avgPop = parseInt(res.results.reduce((total, next) => total + next.Popularity, 0) / numSongs, 10);
                        var minPop = res.results.reduce((min, next) => min.Popularity < next.Popularity ? min : next, 1000).Popularity;
                        var maxPop = res.results.reduce((max, next) => max.Popularity > next.Popularity ? max : next, 0).Popularity;
                        
                        this.setState({pop: [avgPop, minPop, maxPop]})
                    })
                })
            })
        })
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

        return (
            <div style={{alignContent: 'center'}}>
                {/* TODO add props to MenuBar */}
                <MenuBar /> 
                <div style={{marginTop: 20, marginLeft: 20}}>
                    <h3> Analysis </h3>
                    <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>

                        <div>
                            <h4 style={headerStyle}> Genre </h4>
                            <h5 style={avgStyle}> Avg: 100 </h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <h6 style={mStyle}>Min: 20</h6>
                                <h6>Max: 20</h6>
                            </div>
                        </div>

                        <div style={{ marginLeft: 20 }}>
                            <h4 style={headerStyle}> Popularity </h4>
                            <h5 style={avgStyle}> Avg: {this.state.pop[0]} </h5>
                            <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                <h6 style={mStyle}>Min: {this.state.pop[1]}</h6>
                                <h6>Max: {this.state.pop[2]}</h6>
                            </div>
                        </div>

                        <div style={{marginLeft: 20 }}>
                            <h4 style={headerStyle}> Popularity </h4>
                            <h5 style={avgStyle}> 100 </h5>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <h6 style={mStyle}>20</h6>
                                <h6>20</h6>
                            </div>
                        </div>
                        
                    </div>
                    <table>
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
