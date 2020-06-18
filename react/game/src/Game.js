import React from 'react';
import './Game.css';
import Round from './Round.js';
import Landing from './Landing.js';
import Results from './Results.js';
import socket from './socket-context';


class Game extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	gameStatus: 0, /* 0-landing screen:start game, 1- in round, 2- round results, 3-landing screen:end game*/
			leavingGame: false,
			rounds_played: 0,
			all_players: {},
			tokens: {
						"p1" : 0,
						"p2" : 0,
						"p3" : 0
					},
			roundWinner: " ",
			gameWinner: " ",
			cardsAtRoundEnd: [],
			userID: ' ',
			username: ' '
		};
		this.landingCallback = this.landingCallback.bind(this);
		this.roundCallback = this.roundCallback.bind(this);
		this.resultsCallback = this.resultsCallback.bind(this);

		this.landingRef = React.createRef();
		this.roundRef = React.createRef();
	}


	componentDidMount() {
	   	socket.onopen = () => {
			console.log('WebSocket Client Connected');
			socket.send(JSON.stringify({'type':'players'}));
		};
		
		socket.onmessage = (event) => {
	   		var obj = JSON.parse(event.data);
			console.log(obj);
			console.log(obj.type);
			
			if(obj.type === 'playersS'){
				this.landingRef.current.getPlayers(obj);
			}
			else if(obj.type === 'startGame'){
				this.landingRef.current.getStartGame(obj);
			}
			else if(obj.type === 'turn'){
				this.roundRef.current.getTurn(obj);
			}
			else if(obj.type === 'playComponent'){
				this.roundRef.current.getPlay(obj);
			}
			else if(obj.type === 'results'){
				this.roundRef.current.getResults(obj);
			}
		}
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
			roundWinner: roundData.roundWinner,
			gameWinner: roundData.gameWinner,
			cardsAtRoundEnd: roundData.finalCards
		});
		console.log("gameStatus set to 2")
	}

	resultsCallback = (resultsData) => {
		if(this.state.gameWinner!==null && resultsData===true) {
			this.setState({
				gameStatus: 0,
				leavingGame: false
			});
			socket.send(JSON.stringify({'type':'players'}));
		}
		else if(this.state.gameWinner===null && resultsData===true) {
			this.setState({
				gameStatus: 1
			});
		}
		else {
			this.setState({
				gameStatus: 0,
				leavingGame: true
			});
		}
	}

	render() {
		if (this.state.gameStatus===0)
			return (<Landing ref={this.landingRef} leavingGame={this.state.leavingGame} 
						gameCallback = {this.landingCallback} socket={socket}/>);
		else if (this.state.gameStatus===1)
		    return (<Round ref={this.roundRef} gameCallback={this.roundCallback} all_players={this.state.all_players}
		    				userID={this.state.userID} socket={socket}/>);
		else if (this.state.gameStatus===2)
			return(<Results points={this.state.tokens} allPlayers={this.state.all_players} winner={this.state.roundWinner} 
					gameWinner={this.state.gameWinner} cardsAtRoundEnd={this.state.cardsAtRoundEnd} gameCallback={this.resultsCallback}/>);
	}
}

export default Game;
