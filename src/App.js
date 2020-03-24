import React from "react";
import "./App.css";
import _ from "lodash";
import { loadSounds, playSound } from "./services/shared";
import InstrumentArea from "./components/InstrumentArea";
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
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tom.wav"
      },
      tempo: 80,
      bar: 8,
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
      connectors[element].connect(context.destination);
    }

    loadSounds(context, buffer, soundmap);
    this.setState({ context, buffer, pattern, soundkeys, connectors });
  };

  start = () => {
    let { tempo, isPlaying } = this.state;
    console.log(tempo, isPlaying);
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
      console.log(change, pattern[selectedSound][pos]);
    }
    this.setState({ pattern });
  };

  render() {
    console.log(this.state);
    let { soundkeys, bar, connectors } = this.state;
    return (
      <div>
        {!_.isEmpty(connectors) && (
          <div>
            <button
              onClick={this.state.isPlaying === false ? this.start : this.stop}
            >
              {this.state.isPlaying === false ? "start" : "stop"}
            </button>

            <InstrumentArea
              soundkeys={soundkeys}
              changeSelectedSounds={this.changeSelectedSounds}
              connectors={connectors}
            />
            <PadArea bar={bar} handleClick={this.handleClick} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
