import React from 'react';

import MenuBar from '../components/MenuBar';

class AnalysisPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playlistURL: window.location.search.substr(10),
            playlist: {}
        }
        console.log(props)
        console.log(window.location.search.substr(1))
        console.log(window.location.search.substr(10))

    }

    componentDidMount() {
        this.getSongs();
    }

    getSongs() {
        //fetch('https://api.spotify.com/v1/playlists/' + this.state.playlistURL + '/tracks')
            //.then((results) => console.log(results))
            //.then(( results ) => this.setState({ playlist: results }));
        fetch('https://api.spotify.com/v1/playlists/7l6kNrnD8SxgtoKFPBjCLg/tracks')
            .then((results) => console.log(results))
    }

    render() {
        return (
            <div>
                <MenuBar />
                Analysis page
            </div>
        )
    }
}

export default AnalysisPage
