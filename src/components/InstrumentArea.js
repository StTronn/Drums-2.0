import React from "react";
import Instrument from "./Instrument";
import '../main.css';
export default class InstrumentArea extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedSound: null,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedSound !== this.props.selectedSound) {
      let { selectedSound } = this.props;
      this.setState({ selectedSound })
    }
  }



  render() {
    let { soundkeys, changeSelectedSounds, connectors, context, endConnector,handleEnvelope } = this.props;
    let { selectedSound } = this.state;
    return (
      <div className="instrumentArea">
        {soundkeys.map((o, i) => {
          return (
            <Instrument
              key={i}
              context={context}
              changeSelectedSounds={changeSelectedSounds}
              selected={selectedSound === o ? true : false}
              soundkey={o}
              connector={connectors[o]}
              endConnector={endConnector}
              handleEnvelope={handleEnvelope}
            />
          );
        })}
      </div>
    );
  }
}
