import React from "react";
import "../main.css"
export default class TempoButton extends React.Component {

  constructor(props){
    super(props);
    this.state={
        tempo:70,
    }
  }
  handleChange=(event)=>{
    this.setState({tempo:event.target.value})
  }
  
  handleSubmit= (event)=>{
    if (event.key==="Enter"){
      let {changeTempo,tempo}=this.props;
      changeTempo(event.target.value-tempo);
    }
  }

  componentDidMount(){
    let {tempo}=this.props;
    this.setState({tempo}) 
  }
  render() {
    let { tempo, changeTempo } = this.props;
    return (
      <div style={{float:'left'}} className="tempoCointainer">
        <h5>TEMPO</h5>
        <div className="value-button" id="decrease"
          onClick={() => {
            changeTempo(-10);
          }}
        >
          -
        </div>
        <input type="number" id="number" onChange={this.handleChange} onKeyPress={this.handleSubmit} value={this.state.tempo} />
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
