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

		// socket.on('disconnect', () => {
		//     console.log(this.state.username + ' disconnected');
		//     const index = this.state.all_players.indexOf(this.state.username);
		//     this.setState({all_players: all_players.splice(index, 1)});
		// });

		socket.onmessage = (event) => {
	   		var obj = JSON.parse(event.data);
			console.log(obj);
			console.log(obj.type);
			
			if(obj.type === 'playersS')
				this.landingRef.current.getPlayers(obj);
			else if(obj.type === 'startGame')
				this.landingRef.current.getStartGame(obj);
			else if(obj.type === 'turn')
				this.roundRef.current.getTurn(obj);
			else if(obj.type === 'next') //This has been added just to test going to next turn and to play a round
				socket.send(JSON.stringify({'type':'ready'}));
			else if(obj.type === 'results')
				this.roundRef.current.getResults(obj);
		}
	}


	landingCallback = (landingData) => {
		this.setState({
			gameStatus: landingData.gameStatus,
			all_players: landingData.all_players,
			userID: landingData.userID,
			username: landingData.username
		});
		console.log("landingData=", landingData)
	}

	roundCallback = (roundData) => {
		this.setState({
			rounds_played: this.state.rounds_played+1,
			tokens: roundData.tokens,
			gameStatus: 2,
			roundWinner: roundData.roundWinner,
			gameWinner: roundData.gameWinner
		});
	}

	resultsCallback = (resultsData) => {
		if(this.state.gameWinner!==null && resultsData===true) {
			this.setState({
				gameStatus: 0,
				leavingGame: false
			});
			console.log('set state=0');
		}
		else if(this.state.gameWinner===null && resultsData===true) {
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
			return (<Landing ref={this.landingRef} leavingGame={this.state.leavingGame} 
						gameCallback = {this.landingCallback} socket={socket}/>);
		else if (this.state.gameStatus===1)
		    return (<Round ref={this.roundRef} gameCallback={this.roundCallback} all_players={this.state.all_players}
		    				userID={this.state.userID} username={this.state.username} socket={socket}/>);
		else if (this.state.gameStatus===2)
			return(<Results points={this.state.tokens} winner={this.state.roundWinner} 
					gameWinner={this.state.gameWinner} gameCallback={this.resultsCallback}/>);
	}
}

export default Game;
