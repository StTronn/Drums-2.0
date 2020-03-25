import React from "react";

export default class Instrument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: 1,
      gainNode: null
    };
  }
  componentDidMount() {
    let { connector, context } = this.props;
    let gainNode = context.createGain();
    connector.connect(gainNode);
    gainNode.connect(context.destination);
    this.setState({ gainNode });
  }
  handleChange = event => {
    this.setState({ volume: event.target.value });
  };
  render() {
    let { changeSelectedSounds, connector, soundkey } = this.props;
    let { volume, gainNode } = this.state;
    if (gainNode !== null) gainNode.gain.value = volume;
    return (
      <span>
        <input
          type="range"
          id="volume"
          min="0"
          max="2"
          value={volume}
          step="0.01"
          onChange={this.handleChange}
        />
        <button
          onClick={() => {
            changeSelectedSounds(soundkey);
          }}
        >
          {soundkey}
        </button>
      </span>
    );
  }
}
