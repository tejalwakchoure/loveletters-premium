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
	    	gameStatus: 0, /* 0-landing screen start game, 1- in round, 2- round results, 3-landing screen end game*/
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
				console.log('playersS received @'+this.state.username)
			}
			else if(obj.type === 'startGame'){
				this.landingRef.current.getStartGame(obj);
				console.log('startGame received @'+this.state.username)
			}
			else if(obj.type === 'turn'){
				console.log('turn received @'+this.state.username)
				this.roundRef.current.getTurn(obj);
				console.log('turn sent back to round @'+this.state.username)
			}
			else if(obj.type === 'playComponent'){
				console.log('playComponent received @'+this.state.username)
				this.roundRef.current.getPlay(obj);
				console.log('playComponent sent back to round @'+this.state.username)
			}
			else if(obj.type === 'results'){
				console.log('results received @'+this.state.username)
				this.roundRef.current.getResults(obj);
				console.log('results sent back to round @'+this.state.username)
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
		console.log("player info received from landing:", landingData)
		console.log("set gameStatus to 1")
	}

	roundCallback = (roundData) => {
		// const tempCards = this.state.cardsAtRoundEnd;
		// tempCards.push(roundData.currentCards);
		this.setState({
			rounds_played: this.state.rounds_played+1,
			tokens: roundData.tokens,
			gameStatus: 2,
			roundWinner: roundData.roundWinner,
			gameWinner: roundData.gameWinner,
			cardsAtRoundEnd: roundData.finalCards //tempCards
		});
		console.log("results received from Round @"+ this.state.username)
		console.log("set gameStatus to 2")
		console.log("values got from round:", roundData)
	}

	resultsCallback = (resultsData) => {
		if(this.state.gameWinner!==null && resultsData===true) {
			this.setState({
				gameStatus: 0,
				leavingGame: false
			});
			console.log('We have a game winner; set state=0 to start new game @'+ this.state.username);
			console.log('WebSocket Client reconnected');
			socket.send(JSON.stringify({'type':'players'}));
		}
		else if(this.state.gameWinner===null && resultsData===true) {
			this.setState({
				gameStatus: 1
			});
			console.log('No game winner yet; set state=1 to start next round @'+ this.state.username);
		}
		else {
			this.setState({
				gameStatus: 0,
				leavingGame: true
			});
			console.log('set state=0 and @'+ this.state.username+' is leaving the game');
		}
	}

	render() {
		if (this.state.gameStatus===0)
			return (<Landing ref={this.landingRef} leavingGame={this.state.leavingGame} 
						gameCallback = {this.landingCallback} socket={socket} 
						username={this.state.username}/>); //remove username, only for testing
		else if (this.state.gameStatus===1)
		    return (<Round ref={this.roundRef} gameCallback={this.roundCallback} all_players={this.state.all_players}
		    				userID={this.state.userID} username={this.state.username} socket={socket}/>);
		else if (this.state.gameStatus===2)
			return(<Results points={this.state.tokens} allPlayers={this.state.all_players} winner={this.state.roundWinner} 
					gameWinner={this.state.gameWinner} cardsAtRoundEnd={this.state.cardsAtRoundEnd} gameCallback={this.resultsCallback}/>);
	}
}

export default Game;
