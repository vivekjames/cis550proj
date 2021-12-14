import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getRecsUserInput, getRecsDegrees, getRecsCharts } from '../fetcher'

import { addToPlaylistTable, getUserData } from '../fetcher'

//Columns for the Attribute Search 
const userInputColumns = [
    {
        title: 'Track',
        dataIndex: 'Track',
        key: 'Track'
    },
    {
        title: 'Artist',
        dataIndex: 'Artist',
        key: 'Artist'
    }
]

//Columns for the N Degree Search 
const degColumns = [
    {
        title: 'Artist',
        dataIndex: 'artistname',
        key: 'artistname'
        //sorter: (a, b) => a.Name.localeCompare(b.Name),
        //render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
    },
    {
        title: 'Track',
        dataIndex: 'name',
        key: 'name'
        //sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
    },
    {
        title: 'N Degree',
        dataIndex: 'n',
        key: 'n'
        //sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
    },
    {
        title: 'Energy',
        dataIndex: 'energy',
        key: 'energy'
        //sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
    }
]

//Columns for the 
const chartColumns = [
    {
        title: 'Track',
        dataIndex: 'Name',
        key: 'Name'
    },
    {
        title: 'Artist',
        dataIndex: 'Artist',
        key: 'Artist'
    },
    {
        title: 'TrackRank',
        dataIndex: 'TrackRank',
    }
]

class RecsPage extends React.Component {
    constructor(props) {
        super(props)

        const urlParams = new URLSearchParams(window.location.search);


        this.state = {
            energyQuery: 0.5,
            genreQuery: 'Pop',
            acousticQuery: '0.5',
            danceQuery: '0.5',
            yearHighQuery: '2021',
            yearLowQuery: '1960',
            userInputResults: [],
            trackNameQuery: '',
            artistNameQuery: '',
            degResults: [],
            chartSongQuery: '',
            chartArtistQuery: '',
            chartResults: []
        }

        this.handleGenreQueryChange = this.handleGenreQueryChange.bind(this)
        this.handleEnergyQueryChange = this.handleEnergyQueryChange.bind(this)
        this.handleAcousticQueryChange = this.handleAcousticQueryChange.bind(this)
        this.handleDanceQueryChange = this.handleDanceQueryChange.bind(this)
        this.handleYearLowQueryChange = this.handleYearLowQueryChange.bind(this)
        this.handleYearHighQueryChange = this.handleYearHighQueryChange.bind(this)
        this.updateInputSearchResults = this.updateInputSearchResults.bind(this)

        this.handleTrackQueryChange = this.handleTrackQueryChange.bind(this)
        this.handleArtistQueryChange = this.handleArtistQueryChange.bind(this)
        this.updateDegSearchResults = this.updateDegSearchResults.bind(this)

        this.handleChartSongQueryChange = this.handleChartSongQueryChange.bind(this)
        this.handleChartArtistQueryChange = this.handleChartArtistQueryChange.bind(this)
        this.updateChartSearchResults = this.updateChartSearchResults.bind(this)

    }

    //Route 6 
    handleGenreQueryChange(event) {
        this.setState({ genreQuery: event.target.value })
    }

    handleEnergyQueryChange(event) {
        this.setState({ energyQuery: event.target.value })
    }

    handleAcousticQueryChange(event) {
        this.setState({ acousticQuery: event.target.value })
    }

    handleDanceQueryChange(event) {
        this.setState({ danceQuery: event.target.value })
    }
    handleYearLowQueryChange(event) {
        this.setState({ yearLowQuery: event.target.value })
    }
    handleYearHighQueryChange(event) {
        this.setState({ yearHighQuery: event.target.value })
    }


    updateInputSearchResults() {

        getRecsUserInput(this.state.energyQuery, this.state.genreQuery, this.state.acousticQuery, this.state.danceQuery, this.state.yearLowQuery, this.state.yearHighQuery).then(res => {
            console.log(res.results)
            this.setState({ userInputResults: res.results })
        })
    }

    //Route 8 
    handleTrackQueryChange(event) {
        this.setState({ trackNameQuery: event.target.value })
    }

    handleArtistQueryChange(event) {
        this.setState({ artistNameQuery: event.target.value })
    }

    updateDegSearchResults() {
        getRecsDegrees(this.state.trackNameQuery, this.state.artistNameQuery).then(res => {
            this.setState({ degResults: res.results })
        })
    }

    //Route 9 
    handleChartSongQueryChange(event) {
        this.setState({ chartSongQuery: event.target.value })
    }

    handleChartArtistQueryChange(event) {
        this.setState({ chartArtistQuery: event.target.value })
    }

    updateChartSearchResults() {
        getRecsCharts(this.state.chartSongQuery, this.state.chartArtistQuery).then(res => {
            console.log(res.results)
            this.setState({ chartResults: res.results })
        })
    }

    componentDidMount() {
        getRecsUserInput(this.state.energyQuery, this.state.genreQuery, this.state.acousticQuery, this.state.danceQuery, this.state.yearLowQuery, this.state.yearHighQuery).then(res => {
            this.setState({ userInputResults: res.results })
        })

        getRecsDegrees(this.state.trackNameQuery, this.state.artistNameQuery).then(res => {
            this.setState({ degResults: res.results })
        })

        getRecsCharts(this.state.chartSongQuery, this.state.chartArtistQuery).then(res => {
            console.log(res.results)
            this.setState({ chartResults: res.results })
        })

    }

    //https://open.spotify.com/playlist/61YIZmXlbTDSasXwv4GNhG?si=cc11db4f32e14229

    render() {
        return (
            <div style={{ alignContent: 'center' }}>
                <MenuBar />
                <div style={{ marginTop: 20, marginLeft: 20 }}>
                    <h3 style={{ marginLeft: '5%' }}> Search For a Type of Song! </h3>
                </div>
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Genre</label>
                            <FormInput placeholder="Genre" value={this.state.genreQuery} onChange={this.handleGenreQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Energy</label>
                            <FormInput placeholder="Energy" value={this.state.energyQuery} onChange={this.handleEnergyQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Acousticness</label>
                            <FormInput placeholder="Acousticness" value={this.state.acousticQuery} onChange={this.handleAcousticQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Danceability</label>
                            <FormInput placeholder="Danceability" value={this.state.danceQuery} onChange={this.handleDanceQueryChange} />
                        </FormGroup></Col>

                    </Row>
                    <br></br>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Minimum Year</label>
                            <FormInput placeholder="Minimum Year" value={this.state.yearLowQuery} onChange={this.handleYearLowQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Maximum Year</label>
                            <FormInput placeholder="Maximum Year" value={this.state.yearHighQuery} onChange={this.handleYearHighQueryChange} />
                        </FormGroup></Col>

                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateInputSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>


                </Form>

                <Divider />
                <Table dataSource={this.state.userInputResults} columns={userInputColumns} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />
                <Divider />

                <div style={{ marginTop: 20, marginLeft: 20 }}>
                    <h3 style={{marginLeft: '5%'}}> Songs with Similar Energy </h3>
                </div>

                <Row>
                    <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                        <label>Song Title</label>
                        <FormInput placeholder="Your song of choice" value={this.state.trackNameQuery} onChange={this.handleTrackQueryChange} />
                    </FormGroup></Col>
                    <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                        <label>Artist</label>
                        <FormInput placeholder="Your artist of choice" value={this.state.artistNameQuery} onChange={this.handleArtistQueryChange} />
                    </FormGroup></Col>

                    <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                        <Button style={{ marginTop: '4vh' }} onClick={this.updateDegSearchResults}>Search</Button>
                    </FormGroup></Col>

                </Row>

                <Divider />
                <Table dataSource={this.state.degResults} columns={degColumns} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />
                <Divider />

                <div style={{ marginTop: 20, marginLeft: 20 }}>
                    <h3 style={{ marginLeft: '5%' }}> Rec Charts </h3>
                </div>

                <Row>
                    <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                        <label>Song Title</label>
                        <FormInput placeholder="Your song of choice" value={this.state.chartSongQuery} onChange={this.handleChartSongQueryChange} />
                    </FormGroup></Col>
                    <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                        <label>Artist</label>
                        <FormInput placeholder="Your artist of choice" value={this.state.chartArtistQuery} onChange={this.handleChartArtistQueryChange} />
                    </FormGroup></Col>

                    <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                        <Button style={{ marginTop: '4vh' }} onClick={this.updateChartSearchResults}>Search</Button>
                    </FormGroup></Col>

                </Row>

                <Divider />
                <Table dataSource={this.state.chartResults} columns={chartColumns} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />
                <Divider />
            </div>
        )
    }
}

export default RecsPage
