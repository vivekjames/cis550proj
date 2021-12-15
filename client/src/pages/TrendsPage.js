import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,
    Slider

} from 'antd'

import MenuBar from '../components/MenuBar';

import { getmaxWeeks, getavgPeakRankGenre, getSongChars, userpopularTracks } from '../fetcher'

// Gives the columns for the average characteristics given 2 thresholds
const avgcolumns = [
    {
        title: 'Average Peak',
        dataIndex: 'AvgPeak',
        key: 'AvgPeak',
        sorter: (a, b) => a.AvgPeak - b.AvgPeak
    },
    {
        title: 'Average Characteristic 1',
        dataIndex: 'AvgChar1',
        key: 'AvgChar1',
        sorter: (a, b) => a.AvgChar1 - b.AvgChar1

    },
    {
        title: 'Average Characteristic 2',
        dataIndex: 'AvgChar2',
        key: 'AvgChar2',
        sorter: (a, b) => a.AvgChar2 - b.AvgChar2

    },
    {
        title: 'Artist',
        dataIndex: 'Artist',
        key: 'Artist',
        sorter: (a, b) => a.Artist.localeCompare(b.Artist)

    }
];

// Gives the columns for the song with the most number of weeks on Billboard
const maxweekcolumns = [
    {
        title: 'Track Name',
        dataIndex: 'TrackName',
        key: 'trackname',
        sorter: (a, b) => a.Artist.localeCompare(b.Artist)
    },
    {
        title: 'Artist',
        dataIndex: 'TrackArtist',
        key: 'trackartist',
        sorter: (a, b) => a.trackartist.localeCompare(b.trackartist)

    },
    {
        title: 'Weeks On Board',
        dataIndex: 'WeeksOnBoard',
        key: 'weeksonboard',
        sorter: (a, b) => a.weeksonboard - b.weeksonboard

    }

];

// Gives the columns for the average peak rank for each genre in the playlist
const avgpeakcolumns = [
    {
        title: 'Average Peak Rank',
        dataIndex: 'AvgPeakRank',
        key: 'AvgPeakRank',
        sorter: (a, b) => a.AvgPeakRank - b.AvgPeakRank
    },
    {
        title: 'Genre',
        dataIndex: 'Genre',
        key: 'Genre',
        sorter: (a, b) => a.Genre.localeCompare(b.Genre)

    }

];

// Gives the columns for the track, artist, peak rank and popularity for user songs in the playlist
const userpopularcolumns = [
    {
        title: 'Track Name',
        dataIndex: 'Track',
        key: 'Track',
        sorter: (a, b) => a.Track.localeCompare(b.Track)
    },
    {
        title: 'Artist',
        dataIndex: 'Artist',
        key: 'Artist',
        sorter: (a, b) => a.Artist.localeCompare(b.Artist)

    },
    {
        title: 'Peak Rank',
        dataIndex: 'PeakRank',
        key: 'PeakRank',
        sorter: (a, b) => a.PeakRank - b.PeakRank

    },
    {
        title: 'Popularity',
        dataIndex: 'Popularity',
        key: 'Popularity',
        sorter: (a, b) => a.Popularity - b.Popularity

    },

];

class TrendsPage extends React.Component {
    constructor(props) {
        super(props)

        const urlParams = new URLSearchParams(window.location.search);

        this.state = {
            char1: "",
            char2: "",
            threshold1: 0.5,
            threshold2: 0.5,
            maxWeeksResults: [],
            avgPeakRankGenreResults: [],
            songCharsResults: [],
            userPopularTracksResults: [],
            playlistMetaData: [],
        }

        this.handleChar1Change = this.handleChar1Change.bind(this)
        this.handleChar2Change = this.handleChar2Change.bind(this)
        this.handleThreshold1Change = this.handleThreshold1Change.bind(this)
        this.handleThreshold2Change = this.handleThreshold2Change.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)

    }

    //Handle Event Changes for Route 4 
    handleChar1Change(event) {
        this.setState({ char1: event.target.value })
    }

    handleChar2Change(event) {
        this.setState({ char2: event.target.value })
    }

    handleThreshold1Change(event) {
        this.setState({ threshold1: event })
    }

    handleThreshold2Change(event) {
        this.setState({ threshold2: event })
    }

    updateSearchResults() {
        getSongChars(this.state.char1, this.state.char2, this.state.threshold1, this.state.threshold2).then(res => {
            this.setState({ songCharsResults: res.results })
        })
    }

    componentDidMount() {
        getmaxWeeks().then(res => {
            this.setState({ maxWeeksResults: res.results })
        })

        getavgPeakRankGenre().then(res => {
            this.setState({ avgPeakRankGenreResults: res.results })
        })


        userpopularTracks().then(res => {
            console.log('ok')
            console.log(res)
            this.setState({ userPopularTracksResults: res.results })
        })
    }


    
    render() {
        return (
            <div style={{ alignContent: 'center' }}>
                {/* Prompts the user for 2 characteristics and thresholds*/}
                <MenuBar />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <h3>Averages Of 2 Characteristics Using Thresholds</h3>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Characteristic 1</label>
                            <FormInput placeholder="Characteristic 1" value={this.state.char1} onChange={(event) => this.handleChar1Change(event)} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Threshold 1</label>
                            <Slider min={0} max={1.0} step={0.01} onChange={(event) => this.handleThreshold1Change(event)} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Characteristic 2</label>
                            <FormInput placeholder="Characteristic 2" value={this.state.char2} onChange={(event) => this.handleChar2Change(event)} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Threshold 2</label>
                            <Slider min={0} max={1.0} step={0.01} onChange={(event) => this.handleThreshold2Change(event)} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh', backgroundColor: 'rgb(23,175,100)', borderColor: 'rgb(23,175,100)'}} onClick={this.updateSearchResults}>Update</Button>
                        </FormGroup></Col>
                    </Row>

                {/* Returns the artists have average of the given the characteristics that are greater than
                the given thresholds*/}
                </Form>
                <Divider />
                <Table dataSource={this.state.songCharsResults} columns={avgcolumns} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />

                {/* Returns the song with the max number of weeks on Billboard Hot 100*/}
                <Divider />
                <h3 style={{paddingLeft: '10%'}}>Max Week for Tracks on Your Playlist</h3>

                <Table dataSource={this.state.maxWeeksResults} columns={maxweekcolumns} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />

                <Divider />
                {/* Returns average peak rank of the genres of the user given playlist*/}
                <Divider />
                <h3 style={{ paddingLeft: '10%' }}>Average Peak of Each Genre</h3>

                <Table dataSource={this.state.avgPeakRankGenreResults} columns={avgpeakcolumns} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />

                <Divider />
                {/* Returns the songs in the user given playlist that are in the Billboard Hot 100*/}
                <Divider />
                <h3 style={{ paddingLeft: '10%' }}>Rank Popular Tracks on Your Playlist</h3>

                <Table dataSource={this.state.userPopularTracksResults} columns={userpopularcolumns} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />

                <Divider />


            </div>
        )
    }
}

export default TrendsPage
