import React from 'react';

import MenuBar from '../components/MenuBar';

import { addToPlaylistTable, getUserData, getUserInput } from '../fetcher'


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
            playlistMetaData: []
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
                        this.setState({playlistMetaData: res.results});
                    })
                })
            })
        })
    }

    render() {
        return (
            <div style={{alignContent: 'center'}}>
                {/* TODO add props to MenuBar */}
                <MenuBar /> 
                <div style={{marginTop: 20, marginLeft: 20}}>
                    <h3> Analysis </h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Artist</th>
                                <th>Name</th>
                                <th>Track ID</th>
                                <th>Duration</th>
                                <th>Genre</th>
                                <th>Acousticness</th>
                                <th>Danceability</th>
                                <th>Popularity</th>
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
                                        <td>{item.Acousticness}</td>
                                        <td>{item.Danceability}</td>
                                        <td>{item.Popularity}</td>
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
