import React from "react";

export default class PadArea extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      pattern:null,
      counter:0,
      isPlaying:false,
    }
  }
  componentDidMount() {
    let {bar}=this.props;
    let pattern= new Array(bar).fill(0);
    this.setState({pattern})
  }

  componentDidUpdate(prevProps){

    if(prevProps !== this.props){
      let {counter,isPlaying,padPattern,bar}=this.props;
      if (padPattern===undefined) {
        this.setState({pattern:new Array(bar).fill(0),counter,isPlaying})        
      }

      else {
        this.setState({pattern:padPattern,counter,isPlaying})
      }
      
    }
  }


  render() {
    let { bar, handleClick } = this.props;
    let {pattern,isPlaying,counter}=this.state;
    let arr=[]
    for (let i=0;i<bar;i++) {
      if (isPlaying && i===counter)
        arr.push("currentPad");
      else if (pattern && pattern[i]==1)
        arr.push("padGlow");
      else 
        arr.push("pad");
    }

    //console.log(this.props);
    return (
      <div className="padArea">
        
        {[...Array(bar)].map((e, i) => (
          <div className={arr[i]}
            key={i}
            onClick={() => {
              handleClick(i);
            }}
          >
           <h6>{i+1}</h6> 
          </div>
        ))}
      </div>
    );
  }
}
