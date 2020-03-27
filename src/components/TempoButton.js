import React from "react";
import "../main.css"
export default class TempoButton extends React.Component {
  render() {
    let { tempo, changeTempo } = this.props;

    return (
      <div className="tempoCointainer">
        <h5>TEMPO</h5>
        <div className="value-button" id="decrease"
          onClick={() => {
            changeTempo(-10);
          }}
        >
          -
        </div>
        <input type="number" id="number" value={tempo} />
        <div className="value-button" id="increase"
          onClick={() => {
            changeTempo(10);
          }}
        >
          +
        </div>
      </div>
    );
  }
}
