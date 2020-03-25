import React from "react";

export default class Instrument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gainNodeValue: 0
    };
  }
  componentDidMount() {
    let { connector, context } = this.props;
    console.log(this.props);
    connector.connect(context.destination);
  }
  render() {
    let { changeSelectedSounds, connector, soundkey } = this.props;
    return (
      <button
        onClick={() => {
          changeSelectedSounds(soundkey);
        }}
      >
        {soundkey}
      </button>
    );
  }
}
