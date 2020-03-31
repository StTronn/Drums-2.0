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

  render() {
    let { changeSelectedSounds, handleEnvelope, soundkey } = this.props;
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
          }}
        >
          -
        </div>

        <div className="filter-value" >{}</div>
        <div className="filter-button" id="increase"
          onClick={() => {
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
      </div>
    );
  }
}
