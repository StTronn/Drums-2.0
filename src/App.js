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
			isplaying:false,
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
		//console.log(pattern);
		//let pattern= new Array(soundkeys).fill(0).map(()=> new Array(bar).fill(0));
		loadSounds(context, buffer, soundmap);
		this.setState({context,buffer,pattern,soundkeys})
	}

	handleClick = () => {
		let { context, buffer } = this.state;
		playSound(context, buffer.kick, 0);
	}

	render() {
		console.log(this.state);
		return (
			<div>
				hello new world
				<button onClick={this.handleClick}>Hello world</button>
			</div>
		)
	}

}


export default App;
