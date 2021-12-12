import React, {} from 'react';

import { login, test } from '../fetcher'


class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      playlistURL: "",

    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }



  handleSubmit() {

    var sURL = "open.spotify.com/playlist/";
    if (!this.state.playlistURL) {
      alert("Empty input");
    } //else if (!this.state.playlistURL.includes(sURL)) {
      //alert("Not a valid Spotify playlist")
    //} 
    else {
      login().then(res => {
        console.log(res);
        alert("Done login!");
      })
      var start = this.state.playlistURL.indexOf(sURL) + sURL.length;
      var end = this.state.playlistURL.indexOf("?");
      var playlistID = this.state.playlistURL.substring(start, end);

      //window.location = `/analysis/?playlist=${playlistID}`;
    }
  }

  componentDidMount() {
  }



  render() {

    return (
      <div style={{}}>

        <div style={{display: 'flex', justifyContent: 'center', marginTop: '10%'}}>
          <h1>Spotify Final Project Name</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
          <h4>Analyze your Spotify playlist</h4>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', marginTop: '0%'}}>
          <form onSubmit={this.handleSubmit} style={{alignSelf: 'center'}}>
            <label>
              <input type="text" name="textInput" style={{width: 400, height: 40}} onChange={(event) => this.setState({ playlistURL: event.target.value})}/>
            </label>
          </form>
          <button onClick={this.handleSubmit} style={{marginLeft: 10, height: 40}}>Analyze</button>
          <a href="https://accounts.spotify.com/authorize?response_type=code&client_id=20038c715a704136bd16ff016feeb3b9&scope=playlist-read-private&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fanalysis%2F&state=asdfghjklzxcvbnm">hi</a>
        </div>


      </div>
    )
  } //https://accounts.spotify.com/authorize?response_type=code&client_id=20038c715a704136bd16ff016feeb3b9&scope=playlist-read-public%20playlist-read-private&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fanalysis%2F&state=state

}

export default HomePage

