import React from "react";

export default class PadArea extends React.Component {
  render() {
    let { bar, handleClick } = this.props;
    return (
      <div>
        {[...Array(bar)].map((e, i) => (
          <button
            key={i}
            onClick={() => {
              handleClick(i);
            }}
          >
            ♦
          </button>
        ))}
      </div>
    );
  }
}
