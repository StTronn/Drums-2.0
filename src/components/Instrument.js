import React from "react";
import '../main.css';
import Envelope from 'envelope-generator';

export default class Instrument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      volume: 1,
      gainNode: null
    };
  }

  componentDidMount() {
    let { connector, context, endConnector } = this.props;
    let gainNode = context.createGain();
    let env = new Envelope(context, {
      attackTime: 0.1,
      decayTime: 3,
      sustainLevel: 0.4,
      releaseTime: 0.1
    });
    


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
    let { changeSelectedSounds, connector, soundkey } = this.props;
    let { volume, gainNode, selected } = this.state;
    if (gainNode !== null) gainNode.gain.value = volume;
    return (
      <div className="instrument">
        <div className="range-slider">
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
