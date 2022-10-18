import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-tsparticles';
import './App.css';


const particlesOptions = {
    particles: {
        links: {
            distance: 150,
            enable: true,
        },
        move: {
            enable: true,
        },
        size: {
            value: 1,
        },
        shape: {
            type: "circle",
        },
    },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: [],
      route: "signin",
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data, i) => {
      let clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
      let image = document.getElementById('inputimage');
      let width = Number(image.width);
      let height = Number(image.height);
      return {
        leftcol: clarifaiFace.left_col * width,
        toprow: clarifaiFace.top_row * height,
        rightcol: width - (clarifaiFace.right_col * width),
        bottomrow: height - (clarifaiFace.bottom_row * height)
      }
  }

  displayBox = (box) => {
    console.log(box)
    this.setState({
      box: [...this.state.box, box]
    });
  }

  onInputChange = (event) => {
    this.setState({
      box: [],
      input: event.target.value}
      );
  }

  onButtonSubmit = (event) => {
    this.setState({
      box: [],
      imageUrl: this.state.input
    })

      const raw = JSON.stringify({
        "user_app_id": {
          "user_id": "b0y3zbwhv7ks",
          "app_id": "e6aae569602243d682cfb54f67a19f71"
        },
        "inputs": [
          {
            "data": {
              "image": {
                "url": this.state.input
              }
            }
          }
        ]
      });
      const requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Key e47a72a10aa84c93b24a2449dbbb2aca'
        },
        body: raw
      };
      // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
      // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
      // this will default to the latest version_id
      fetch("https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs", requestOptions)
        .then(response => response.json())
        .then(result => {
          for(let i = 0; i < result.outputs[0].data.regions.length; i++){
          this.displayBox(this.calculateFaceLocation(result, i));
          }
        })
        .catch(error => console.log('error', error));

  }

  onRouteChange = (r) => {
    if(r === "signout"){
      this.setState({isSignedIn: false})
    } else if(r === "home"){
      this.setState({isSignedIn: true})
    }
    this.setState({route: r});
  }

  render() {
    const { isSignedIn, imageUrl, box, route } = this.state;
    return(
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation 
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
      { route === "home"?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              />
            <FaceRecognition box = {box} imageUrl={imageUrl}/>
          </div>
          :(
            route === "signin" || route === "signout"
            )?
            <SignIn onRouteChange={this.onRouteChange}/>
            :
            <Register onRouteChange={this.onRouteChange} />  
    }
      </div>
      );
  }
}

export default App;
