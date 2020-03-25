import React from "react";
import Instrument from "./Instrument";

export default class InstrumentArea extends React.Component {
  render() {
    let { soundkeys, changeSelectedSounds, connectors, context } = this.props;

    return (
      <div>
        {soundkeys.map((o, i) => {
          return (
            <Instrument
              key={i}
              context={context}
              changeSelectedSounds={changeSelectedSounds}
              soundkey={o}
              connector={connectors[o]}
            />
          );
        })}
      </div>
    );
  }
}
