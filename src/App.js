import React from "react";
import "./App.css";
import "./main.css";
import _ from "lodash";
import { loadSounds, playSound } from "./services/shared";
import SimpleReverb from "./services/reverb";
import InstrumentArea from "./components/InstrumentArea";
import TempoButton from "./components/TempoButton";
import MasterVolume from "./components/MasterVolume";
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
        openhat:"https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/openhat.wav",
        snare:
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav",
        tom:
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tom.wav",
        ride:
          "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/ride.wav"
        
      },
      tempo: 60,
      bar: 16,
      isPlaying: false,
      selectedSound: null,
      counter: 0,
      connectors: {},
      endConnector: null,
      volume: 1,
      reverb:null,
      reverbOn:false, 
      envelopes:null,
    };
  }

  componentDidMount() {
    this.bufferLoad();

  }

  bufferLoad = () => {
    let { bar, soundmap, context, connectors,volume } = this.state;
    let buffer = {};
    let soundkeys = Object.keys(soundmap);
    let pattern = {};
    if (context === null) context = new window.AudioContext();
    let reverb= new SimpleReverb(context, {
      seconds: 0.2,
      decay: 0,
      reverse: 0
    });
    let endConnector = context.createGain();
    endConnector.gain.value=volume;
    endConnector.connect(context.destination);
    let envelopes={};
    
    for (const element of soundkeys) {
      let envelope={attackTime:0.001,decayTime:0.102,sustain:1.3,relaseTime:0.400};
      let arr = new Array(bar).fill(0);
      pattern[element] = arr;
      connectors[element] = context.createGain();
      envelopes[element]=envelope;
      //connectors[element].connect(context.destination);
    }
    loadSounds(context, buffer, soundmap);
    this.setState({ context, buffer, pattern, soundkeys, connectors, endConnector,reverb,envelopes });
  };

  clearPattern = (soundkey)=>{
    let {pattern,bar}=this.state;
    let arr = new Array(bar).fill(0);
    pattern[soundkey]=arr;
    this.setState({pattern});
  }

  start = () => {
    let { tempo, isPlaying } = this.state;
    if (isPlaying === true) return;
    else {
      this.interval = setInterval(this.loop, (60 * 1000) / (tempo*4));
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
    if (tempo + delta >= 50 && tempo + delta <= 180) {
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



  tap = () => {
    this.setState({ selectedSound: null });
  }
  loop = () => {
    let {
      counter,
      bar,
      soundkeys,
      pattern,
      buffer,
      context,
      connectors,
      envelopes,
    } = this.state;
    for (let soundkey of soundkeys) {
      if (pattern[soundkey][counter] === 1) {
        playSound(context, buffer[soundkey], 0, connectors[soundkey],envelopes[soundkey]);
      }
    }
    counter = (counter + 1) % bar;
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

  handleEnvelope = (envelope,soundkey)=>{
    let {envelopes}=this.state;
    
    envelopes[soundkey]=envelope;
    this.setState({envelopes});
  }

  toggleReverb = ()=> {
    let {reverbOn}=this.state;
    
    this.setState({reverbOn:!reverbOn})

  }

  keyHandler = (e) => {
    let { buffer, selectedSound, context,connectors,envelopes } = this.state;
    console.log("hello");
    if (_.isEmpty(buffer) || selectedSound !== null)
      return;
    if (e.keyCode === 97 || e.keyCode == 49)
      playSound(context, buffer['kick'], 0, connectors['kick'],envelopes['kick']);
    if (e.keyCode === 98 || e.keyCode == 50)
      playSound(context, buffer['hihat'], 0, connectors['hihat'],envelopes['hihat']);
    if (e.keyCode === 99 || e.keyCode == 51)
      playSound(context,buffer['openhat'], 0, connectors['openhat'],envelopes['openhat']);        
    if (e.keyCode === 100 || e.keyCode == 52)
      playSound(context,buffer['snare'], 0, connectors['snare'],envelopes['snare']);        
    if (e.keyCode === 101 || e.keyCode == 53)
      playSound(context, buffer['tom'], 0, connectors['tom'],envelopes['tom']);        
    if (e.keyCode === 102 || e.keyCode == 54)
      playSound(context, buffer['ride'], 0, connectors['ride'],envelopes['ride']);        
    
  }

  changeVolume = delta => {
    let {volume}=this.state;
    if (volume+delta>=0 && volume+delta<=2){

      this.setState({volume:volume+delta});
    }
  }

  handleFiltersValue = ()=> {
    let {endConnector,volume,reverb,reverbOn,context}=this.state;
    if (endConnector!==null){
      endConnector.gain.value=volume;
      if (reverbOn){

        endConnector.disconnect();
        endConnector.connect(reverb.input);
        reverb.connect(context.destination);  
      }
      else {
        endConnector.disconnect();
        endConnector.connect(context.destination);
      }
    } 
  
  }
   
  render() {
    let { context, soundkeys, bar, tempo, connectors, endConnector, pattern, selectedSound, isPlaying, counter,volume,reverbOn } = this.state;
    window.addEventListener('keydown', this.keyHandler);
    this.handleFiltersValue();
    return (
      <div >

        {!_.isEmpty(connectors) && (
          <div className="cointainer">
            <div className="overallControl">
              <TempoButton tempo={tempo} changeTempo={this.changeTempo} />
              <MasterVolume volume={volume} changeVolume={this.changeVolume} />
              <div 
                className={reverbOn===true?"reverbButtonSelected":"reverbButton"}
                onClick={this.toggleReverb}
              >
                reverb
              </div>
            </div>

            <InstrumentArea
              soundkeys={soundkeys}
              changeSelectedSounds={this.changeSelectedSounds}
              connectors={connectors}
              endConnector={endConnector}
              context={context}
              selectedSound={selectedSound}
              handleEnvelope={this.handleEnvelope}
              clearPattern={this.clearPattern}
            />
            <PadArea bar={bar} handleClick={this.handleClick} padPattern={pattern[selectedSound]} counter={counter} isPlaying={isPlaying} />
            <div className="controlArea">
              <div className={isPlaying === false ? "start" : "stop"}
                onClick={this.state.isPlaying === false ? this.start : this.stop}
              >
                {this.state.isPlaying === false ? "start" : "stop"}
              </div>
              <div className={selectedSound !== null ? "start" : "stop"}
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
