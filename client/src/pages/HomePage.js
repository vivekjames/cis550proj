import React, {} from 'react';

import { getToken } from '../fetcher'


class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      playlistURL: "",
      loggedIn: false,
      accessToken: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }



  handleSubmit() {

    var sURL = "open.spotify.com/playlist/";
    if (!this.state.playlistURL) {
      alert("Empty input");
    } else if (!this.state.playlistURL.includes(sURL)) {
      alert("Not a valid Spotify playlist")
    } else if (!this.state.loggedIn) {
      alert("Please log in to Spotify first!")
    } else {
      var start = this.state.playlistURL.indexOf(sURL) + sURL.length;
      var end = this.state.playlistURL.indexOf("?");
      var playlistID = this.state.playlistURL.substring(start, end);

      window.location = `/analysis/?playlist=${playlistID}&accessToken=${this.state.accessToken}`;
    }
  }

  componentDidMount() {

    var params = window.location.search;
    console.log(params)
    console.log(params.substring(params.indexOf('code=') + 5, params.indexOf('&state=')));

    var code = params.substring(params.indexOf('code=') + 5, params.indexOf('&state='));
    if (code === "") {
      this.setState({ loggedIn: false})
    } else {
      getToken(code).then(res => {
        console.log(res);
        this.setState({loggedIn: true, accessToken: res.access_token})
      });
      // var xhr = new XMLHttpRequest();

      // var json_data = -1;

      // xhr.open("POST", 'https://accounts.spotify.com/api/token', true);
      // var auth = new Buffer('20038c715a704136bd16ff016feeb3b9:4301f7a93c17480481f132b6eadc3b52').toString('base64');
      // xhr.setRequestHeader('Authorization', auth);
      // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // xhr.onreadystatechange = function () { // Call a function when the state changes.
      //   if (xhr.readyState === 4) {
      //     if (xhr.status === 200) {
      //       console.log("DONE in readyStateChange");
      //       console.log(xhr.responseText);
      //       json_data = xhr.responseText;
      //     } else {
      //       console.log("Error", xhr.statusText);
      //     }
      //   }
      //   /*if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      //     json_data = xhr.responseText;
      //   }*/
      // }
      // xhr.send(JSON.stringify({
      //   code: code,
      //   redirect_uri: 'redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F',
      //   grant_type: 'authorization_code'
      // }));
      console.log("AT END of else");
    }

    
    

  }


  // clientID: 20038c715a704136bd16ff016feeb3b9
  // clientSecret: 4301f7a93c17480481f132b6eadc3b52

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
          <a href="https://accounts.spotify.com/authorize?response_type=code&client_id=20038c715a704136bd16ff016feeb3b9&scope=playlist-read-private&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=asdfghjklzxcvbnm">hi</a>
        </div>


      </div>
    )
  } //https://accounts.spotify.com/authorize?response_type=code&client_id=20038c715a704136bd16ff016feeb3b9&scope=playlist-read-public%20playlist-read-private&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fanalysis%2F&state=state

}

export default HomePage

