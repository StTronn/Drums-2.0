import React from "react";

export default class InstrumentArea extends React.Component {
  render() {
    let { soundkeys, changeSelectedSounds, connectors } = this.props;
    console.log(this.props, connectors);

    return (
      <div>
        {soundkeys.map((o, i) => {
          return (
            <button
              key={i}
              onClick={() => {
                changeSelectedSounds(o);
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    );
  }
}
