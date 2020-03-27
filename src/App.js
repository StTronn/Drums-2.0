import React from "react";
import "./App.css";
import "./main.css";
import _ from "lodash";
import { loadSounds, playSound } from "./services/shared";
import InstrumentArea from "./components/InstrumentArea";
import TempoButton from "./components/TempoButton";
import PadArea from "./components/PadArea";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: {},
      pattern: {},
      soundnames: { kick: "kick", hihat: "hihat" },
      soundkeys: [],
      context: null,
      soundmap: {
        kick:
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/boom.wav",
        hihat:
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/hihat.wav ",
        snare:
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav",
        tom:
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tom.wav",
        ride:
        "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/ride.wav"
        },
      tempo: 160,
      bar: 16,
      isPlaying: false,
      selectedSound: null,
      counter: 0,
      connectors: {}
    };
  }

  componentDidMount() {
    this.bufferLoad();
  }

  bufferLoad = () => {
    let { bar, soundmap, context, connectors } = this.state;
    let buffer = {};
    let soundkeys = Object.keys(soundmap);
    let pattern = {};
    if (context === null) context = new window.AudioContext();

    for (const element of soundkeys) {
      let arr = new Array(bar).fill(0);
      pattern[element] = arr;
      connectors[element] = context.createGain();
      //connectors[element].connect(context.destination);
    }

    loadSounds(context, buffer, soundmap);
    this.setState({ context, buffer, pattern, soundkeys, connectors });
  };

  start = () => {
    let { tempo, isPlaying } = this.state;
    if (isPlaying === true) return;
    else {
      this.interval = setInterval(this.loop, (60 * 1000) / tempo);
      this.setState({ isPlaying: true });
    }
  };
  stop = () => {
    if (this.state.isPlaying === false) return;
    window.clearInterval(this.interval);
    this.setState({ isPlaying: false });
  };

  changeTempo = delta => {
    let { tempo, isPlaying } = this.state;
    let start = this.start;
    if (tempo + delta >= 50 && tempo + delta <= 260) {
      tempo = tempo + delta;
      if (isPlaying === true) {
        this.stop();
        this.setState({ tempo }, () => {
          start();
        });
      } else {
        this.setState({ tempo });
      }
    }
  };
  tap =()=>{
    this.setState({selectedSound:null});
  }
  loop = () => {
    let {
      counter,
      bar,
      soundkeys,
      pattern,
      buffer,
      context,
      connectors
    } = this.state;
    counter = (counter + 1) % bar;
    for (let soundkey of soundkeys) {
      if (pattern[soundkey][counter] === 1) {
        playSound(context, buffer[soundkey], 0, connectors[soundkey]);
      }
    }
    this.setState({ counter });
  };

  changeSelectedSounds = name => {
    this.setState({ selectedSound: name });
  };
  handleClick = pos => {
    //if no sound selected each button will play th kick
    //if (this.state.selectedSound==='pads')
    // get pos and selected sound
    // if selectedsound !=='pads'
    // toggle pattern[selectedsound][pos]
    // mutate
    let { context, buffer, selectedSound, pattern } = this.state;
    if (selectedSound === null) {
      playSound(context, buffer.kick, 0);
    } else {
      const change = pattern[selectedSound][pos] === 0 ? 1 : 0;

      let arr = [];
      for (let i = 0; i < pattern[selectedSound].length; i++) {
        if (i !== pos) arr.push(pattern[selectedSound][i]);
        else arr.push(change);
      }
      pattern[selectedSound] = arr;
    }
    this.setState({ pattern });
  };

  render() {
    let { context, soundkeys, bar, tempo, connectors,pattern,selectedSound,isPlaying,counter } = this.state;
    return (
      <div >
        
        {!_.isEmpty(connectors) && (
          <div className="cointainer">
            <div className="overallControl">
            <TempoButton tempo={tempo} changeTempo={this.changeTempo} />
            </div>

            <InstrumentArea
              soundkeys={soundkeys}
              changeSelectedSounds={this.changeSelectedSounds}
              connectors={connectors}
              context={context}
              selectedSound={selectedSound}
            />
            <PadArea bar={bar} handleClick={this.handleClick} padPattern={pattern[selectedSound]} counter={counter} isPlaying={isPlaying} />
            <div className="controlArea">
            <div className={isPlaying===false?"start":"stop"}
              onClick={this.state.isPlaying === false ? this.start : this.stop}
            >
              {this.state.isPlaying === false ? "start" : "stop"}
            </div>
            <div className={selectedSound!==null?"start":"stop"} 
              onClick={this.tap}
            >
              tap
            </div>

            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
