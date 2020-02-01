import React from 'react';
import './App.css';
import { loadSounds, playSound } from './services/shared';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			buffer: {},
			pattern:{},
			soundnames:{ kick: 'kick',
				hihat:'hihat'},
			soundkeys:[],
			context: null,
			soundmap: { kick: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/boom.wav',
				hihat:'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/hihat.wav '},
			tempo:80,
			bar:8,
			isPlaying:false,
			selectedSound:null,
			counter:0,
		}
	}

	componentDidMount() {
		this.bufferLoad();
	}


	bufferLoad=()=>{
		let {bar,soundmap,context}=this.state;
		let buffer = {};
		let soundkeys=Object.keys(soundmap);
		let pattern = {};
		if (context===null)
			context=new window.AudioContext();

		let arr= new Array(bar).fill(0);
		for (const element of soundkeys) {
			pattern[element]=arr;
		}
		//test
		pattern.hihat[0]=1;
		//console.log(pattern);
		//let pattern= new Array(soundkeys).fill(0).map(()=> new Array(bar).fill(0));
		loadSounds(context, buffer, soundmap);
		this.setState({context,buffer,pattern,soundkeys})
	}

	start=()=>{
		let {tempo,isPlaying} = this.state;
		console.log(tempo,isPlaying);
		if (isPlaying===true)
			return;
		else {
			this.interval = setInterval(this.loop,(60*1000)/tempo)
			this.setState({isPlaying:true});
		}
	}
	stop = ()=>{
		if (this.state.isPlaying ===false)
			return;
		window.clearInterval(this.interval);
		this.setState({isPlaying:false})
	}

	loop=()=>{
		let {counter,bar,soundkeys,pattern,buffer,context}= this.state;
		counter=(counter+1)%bar;
		for (let soundkey of soundkeys) {

			if (pattern[soundkey][counter]===1){
				playSound(context,buffer[soundkey],0);
				
			}
		}
		this.setState({counter});
	}

	handleClick = (pos) => {
		//if (this.state.selectedSound==='pads')
		// get pos and selected sound 
		// if selectedsound !=='pads'
		// toggle pattern[selectedsound][pos]
		let { context, buffer } = this.state;
		playSound(context, buffer.kick, 0);
	}

	render() {
			
		console.log(this.state);
		return (
			<div>
				hello new worl
				<button onClick={this.state.isPlaying===false?this.start:this.stop}>
					{this.state.isPlaying===false?'start':'stop'}
				</button>
					
						
				}
			</div>
		)
	}

}


export default App;
