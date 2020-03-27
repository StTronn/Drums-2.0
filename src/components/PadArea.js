import React from "react";

export default class PadArea extends React.Component {
  render() {
    let { bar, handleClick } = this.props;
    return (
      <div className="padArea">
        {[...Array(bar)].map((e, i) => (
          <div class="pad"
            key={i}
            onClick={() => {
              handleClick(i);
            }}
          >
            
          </div>
        ))}
      </div>
    );
  }
}
