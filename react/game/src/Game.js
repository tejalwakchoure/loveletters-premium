import React from 'react';
import './Game.css';
import Round from './Round.js';
import Landing from './Landing.js';
import Results from './Results.js';

class Game extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	gameStatus: 0, /* 0-landing screen start game, 1- in round, 2- round results, 3-landing screen end game*/
			leavingGame: false,
			rounds_played: 0,
			all_players: {},
			tokens: {
						"p1" : 0,
						"p2" : 0,
						"p3" : 0
					},
			round_winner: " ",
			game_winner: " ",
			userID: ' ',
			username: ' '
		};
		this.landingCallback = this.landingCallback.bind(this);
		this.roundCallback = this.roundCallback.bind(this);
		this.resultsCallback = this.resultsCallback.bind(this);
	}

	landingCallback = (landingData) => {
		this.setState({
			gameStatus: landingData.gameStatus,
			all_players: landingData.all_players,
			userID: landingData.userID,
			username: landingData.username
		});
	}

	roundCallback = (roundData) => {
		this.setState({
			rounds_played: this.state.rounds_played+1,
			tokens: roundData.tokens,
			gameStatus: 2,
			round_winner: roundData.roundWinner,
			game_winner: roundData.gameWinner
		});
	}

	resultsCallback = (resultsData) => {
		if(this.state.gameWinner!==undefined && resultsData===true) {
			this.setState({
				gameStatus: 0,
				leavingGame: false
			});
			console.log('set state=0');
		}
		else if(this.state.gameWinner===undefined && resultsData===true) {
			this.setState({
				gameStatus: 1
			});
			console.log('set state=1');
		}
		else {
			this.setState({
				gameStatus: 0,
				leavingGame: true
			});
			console.log('set state=0 and this player is leaving the game');
		}
	}

	render() {
		if (this.state.gameStatus===0)
			return (<Landing leavingGame={this.state.leavingGame} gameCallback = {this.landingCallback}/>);
		else if (this.state.gameStatus===1)
		    return (<Round gameCallback={this.roundCallback} all_players={this.state.all_players}
		    				userID={this.state.userID} username={this.state.username}/>);
		else if (this.state.gameStatus===2)
			return(<Results points={this.state.tokens} winner={this.state.round_winner} 
					gameWinner={this.state.game_winner} gameCallback={this.resultsCallback}/>);
	}
}

export default Game;
