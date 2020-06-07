import React from 'react';
import './Game.css';
import Round from './Round.js';
import Landing from './Landing.js';
import {Values} from '../assets/values.js';

class Game extends React.Component {
	
	constructor(props) {
	    super(props);
	    var pointsMapping = {}
	    for (var user in Values.all_players) {
	    	pointsMapping[user] = 0;
	    }
	    this.state = {
	    	gameStatus: 0, /* 0-landing screen(start/end game), 1- in round, 2- post round*/
			toStartGame: true,
			points: pointsMapping
		};
	}

	landingCallback = (landingData) => {
      this.setState({gameStatus: landingData})
	}

	render() {
		if (this.state.gameStatus==0)
			return (<Landing toStartGame={this.state.toStartGame} gameCallback = {this.landingCallback}/>);
		else if (this.state.gameStatus==1)
		    return (<Round/>);
		else
			return (<Landing toStartGame={false}/>);
	}
}

export default Game;
