import React from "react";

export default class InstrumentArea extends React.Component {
  render() {
    let { soundkeys, changeSelectedSounds } = this.props;

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
