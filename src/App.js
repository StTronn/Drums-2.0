import React from "react";
import "./App.css";
import { loadSounds, playSound } from "./services/shared";

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
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav"
      },
      tempo: 80,
      bar: 8,
      isPlaying: false,
      selectedSound: null,
      counter: 0
    };
  }

  componentDidMount() {
    this.bufferLoad();
  }

  bufferLoad = () => {
    let { bar, soundmap, context } = this.state;
    let buffer = {};
    let soundkeys = Object.keys(soundmap);
    let pattern = {};
    if (context === null) context = new window.AudioContext();

    for (const element of soundkeys) {
      let arr = new Array(bar).fill(0);
      pattern[element] = arr;
    }

    loadSounds(context, buffer, soundmap);
    this.setState({ context, buffer, pattern, soundkeys });
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
    let { counter, bar, soundkeys, pattern, buffer, context } = this.state;
    counter = (counter + 1) % bar;
    for (let soundkey of soundkeys) {
      if (pattern[soundkey][counter] === 1) {
        playSound(context, buffer[soundkey], 0);
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
    let { pattern, soundkeys, bar } = this.state;
    return (
      <div>
        hello new worl
        <button
          onClick={this.state.isPlaying === false ? this.start : this.stop}
        >
          {this.state.isPlaying === false ? "start" : "stop"}
        </button>
        {soundkeys.map((o, i) => {
          return (
            <button
              key={i}
              onClick={() => {
                this.changeSelectedSounds(o);
              }}
            >
              {o}
            </button>
          );
        })}
        {[...Array(bar)].map((e, i) => (
          <button
            key={i}
            onClick={() => {
              this.handleClick(i);
            }}
          >
            ♦
          </button>
        ))}
      </div>
    );
  }
}

export default App;
