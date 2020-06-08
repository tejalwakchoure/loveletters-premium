import React from 'react';
import './Game.css';
import Round from './Round.js';
import Landing from './Landing.js';
import Results from './Results.js';
import {Values} from '../assets/values.js';

class Game extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	gameStatus: 0, /* 0-landing screen start game, 1- in round, 2- round results, 3-landing screen end game*/
			toStartGame: true,
			rounds_played: 0,
			points: Values.player_points,
			round_winner: " "
		};
		this.landingCallback = this.landingCallback.bind(this);
		this.roundCallback = this.roundCallback.bind(this);
		this.resultsCallback = this.resultsCallback.bind(this);
	}

	landingCallback = (landingData) => {
		this.setState({
			gameStatus: landingData
		})
	}

	roundCallback = (roundData) => {
		const winner = roundData;
		let new_points = this.state.points;
		new_points[winner] = new_points[winner]+1;
		this.setState({
			rounds_played: this.state.rounds_played+1,
			points: new_points,
			gameStatus: 2,
			round_winner: winner
		});
	}

	resultsCallback = (resultsData) => {
		if(resultsData!=" ") {
			this.setState({
				gameStatus: 3,
				round_winner: resultsData
			});
			console.log('results='+resultsData);
			console.log('set state=3');
		}
		else {
			this.setState({
				gameStatus: 1
			});
			console.log('set state=1');
		}
	}

	render() {
		if (this.state.gameStatus==0)
			return (<Landing toStartGame={this.state.toStartGame} gameCallback = {this.landingCallback}/>);
		else if (this.state.gameStatus==1)
		    return (<Round gameCallback={this.roundCallback}/>);
		else if (this.state.gameStatus==2)
			return(<Results points={this.state.points} winner={this.state.round_winner} gameCallback={this.resultsCallback}/>);
		else
			return (<Landing toStartGame={false} final_winner={this.state.round_winner} gameCallback = {this.landingCallback}/>);
	}
}

export default Game;
