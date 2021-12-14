import React from 'react';

import MenuBar from '../components/MenuBar';


import { addToPlaylistTable, getUserData } from '../fetcher'


class TrendsPage extends React.Component {
    constructor(props) {
        super(props)

        const urlParams = new URLSearchParams(window.location.search);
        
        this.state = {
            //TODO add state variables for all the stuff we're showing
        }
    }

    componentDidMount() {
        //TODO call fetcher methods and then set the state variables
    }

    //https://open.spotify.com/playlist/61YIZmXlbTDSasXwv4GNhG?si=cc11db4f32e14229

    render() {
        return (
            <div style={{ alignContent: 'center' }}>
                <MenuBar />
                <div style={{ marginTop: 20, marginLeft: 20 }}>
                    <h3> Trends </h3>
                </div>
            </div>
        )
    }
}

export default TrendsPage
