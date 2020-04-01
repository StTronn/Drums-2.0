import React from "react";
import '../main.css';

export default class Instrument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      volume: 1,
      gainNode: null,
      envelope:{attackTime:0.001,decayTime:0.103,sustain:1.3,relaseTime:0.500}
    };
  }

  componentDidMount() {
    let { connector, context, endConnector,handleEnvelope,soundkey } = this.props;
    let gainNode = context.createGain();
    let envelope={attackTime:0.001,decayTime:0.003,sustain:1.3,relaseTime:0.500};
    connector.connect(gainNode);
    gainNode.connect(endConnector);
    this.setState({ gainNode });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      let { selected } = this.props;
      this.setState({ selected });
    }
  }

  handleChange = event => {
    this.setState({ volume: event.target.value });
  };

  handleEnvelopeChange = (delta,para)=>{
    let {envelope}=this.state;
    let {handleEnvelope, soundkey } = this.props;
    let value=envelope[para];
    
    if (value+delta>=0 && value+delta<=3) {
      envelope[para]=value+delta;
      this.setState({envelope},()=>{
        handleEnvelope(envelope,soundkey)
      });
    }
  }

  render() {
    let { changeSelectedSounds,soundkey,clearPattern } = this.props;
    let { volume, gainNode, selected } = this.state;
    let {envelope}=this.state;
    if (gainNode !== null) gainNode.gain.value = volume;
    return (
      <div className="instrument">
        <div className="rangeSlider">
          <input
            type="range"
            id="volume"
            min="0"
            max="2"
            value={volume}
            step="0.01"
            onChange={this.handleChange}
          />


        </div>
        <div className="filterCointainer">
        <h5>Attack</h5>
        <div className="filter-button" id="decrease"
          onClick={() => {
            this.handleEnvelopeChange(-0.001,'attackTime')
          }}
        >
          -
        </div>

        <div className="filter-value" >{envelope.attackTime*100}</div>
        <div className="filter-button" id="increase"
          onClick={() => {
            this.handleEnvelopeChange(0.001,'attackTime')
          }}
        >
          +
        </div>
      </div>

      <div className="filterCointainer">
        <h5>Decay</h5>
        <div className="filter-button" id="decrease"
          onClick={() => {
            this.handleEnvelopeChange(-0.010,'decayTime')
          }}
        >
          -
        </div>

        <div className="filter-value" >{envelope.decayTime*10}</div>
        <div className="filter-button" id="increase"
          onClick={() => {
            this.handleEnvelopeChange(0.010,'decayTime')
          }}
        >
          +
        </div>
      </div>

      <div className="filterCointainer">
        <h5>sustain</h5>
        <div className="filter-button" id="decrease"
          onClick={() => {
            this.handleEnvelopeChange(-0.1,'sustain')
          }}
        >
          -
        </div>

        <div className="filter-value" >{envelope.sustain}</div>
        <div className="filter-button" id="increase"
          onClick={() => {
            this.handleEnvelopeChange(0.1,'sustain')
          }}
        >
          +
        </div>
      </div>

      <div className="filterCointainer">
        <h5>relase</h5>
        <div className="filter-button" id="decrease"
          onClick={() => {
            this.handleEnvelopeChange(-0.01,'relaseTime')
          }}
        >
          -
        </div>

        <div className="filter-value" >{envelope.relaseTime*10}</div>
        <div className="filter-button" id="increase"
          onClick={() => {
            this.handleEnvelopeChange(0.010,'relaseTime')
          }}
        >
          +
        </div>
      </div>

        <div className={selected === true ? "instrumentButtonSelected" : "instrumentButton"}
          onClick={() => {
            changeSelectedSounds(soundkey);
          }}
        >
          {soundkey}
        </div>
        
        <div className={"clearButton"}
          onClick={() => {
            clearPattern(soundkey);
          }}
        >
          clear
        </div>

      </div>
    );
  }
}
