import React from "react";
import Instrument from "./Instrument";

export default class InstrumentArea extends React.Component {
  render() {
    let { soundkeys, changeSelectedSounds, connectors } = this.props;
    console.log(this.props, connectors);

    return (
      <div>
        {soundkeys.map((o, i) => {
          return (
            <Instrument
              key={i}
              changeSelectedSounds={changeSelectedSounds}
              soundkey={o}
            />
          );
        })}
      </div>
    );
  }
}
