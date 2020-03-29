import React from 'react';

export default class MasterVolume extends React.Component {
    constructor(props){
        super(props);
        this.state={
            
        }
    }

    render(){
        let {volume,changeVolume}= this.props;
        return(
            <div style={{float:'left'}} className="tempoCointainer">
            <h5>VOL</h5>
            <div className="value-button" id="decrease"
              onClick={() => {
                changeVolume(-0.2);
              }}
            >
              -
            </div>
            <input type="number" id="number" value={volume.toFixed(2)*10}/>
            <div className="value-button" id="increase"
              onClick={() => {
                changeVolume(0.2);
              }}
            >
              +
            </div>
          </div>
    
        )
    }
}