import React from "react";

export default class TempoButton extends React.Component {
  render() {
    let { tempo, changeTempo } = this.props;

    return (
      <>
        <button
          onClick={() => {
            changeTempo(10);
          }}
        >
          +
        </button>
        <div>{tempo}</div>
        <button
          onClick={() => {
            changeTempo(-10);
          }}
        >
          -
        </button>
      </>
    );
  }
}
