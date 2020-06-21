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
			num_players: 0,
			players_accepted: 0,
			all_players: {},
			tokens: {},
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

		const card_names = ['Bishop','Dowager Queen','Constable','Count','Sycophant','Baroness','Cardinal','Jester', 
     	                   	'Guard','Assassin','Princess','Countess','King','Prince','Handmaid','Baron','Priest'];
	    let imgs = {};
	    card_names.map((img, index) => {
	        imgs[img] = require('../assets/cards/mini'+img+'.png');
	    	console.log('preloaded '+img)});
	    imgs['loading_card'] = require('../assets/cards/loading_card.jpeg');
	    imgs['display_blank'] = require('../assets/cards/displayBlank.png');
	    card_names.map((img, index) => {
	        imgs[img] = require('../assets/cards/'+img+'.jpeg');
	    	console.log('preloaded '+img)});
	    
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
			else if(obj.type === 'gameOptions'){
				this.landingRef.current.getOptions(obj);
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
			else if(obj.type === 'cardinalView'){
				this.roundRef.current.getCardinalView(obj);
			}
			else if(obj.type === 'readyAll'){
				this.setState({gameStatus: 1});
			}
			else if(obj.type === 'redirect'){
				window.location.replace('/');
			}
	  	}
	}


	landingCallback = (landingData) => {
		this.setState({
			gameStatus: landingData.gameStatus,
			all_players: landingData.all_players,
			num_players: Object.keys(landingData.all_players).length,
			userID: landingData.userID,
			username: landingData.username
		});
	}

	roundCallback = (roundData) => {
		this.setState({
			rounds_played: this.state.rounds_played + 1,
			tokens: roundData.tokens,
			gameStatus: 2,
			roundWinner: roundData.roundWinner,
			gameWinner: roundData.gameWinner,
			cardsAtRoundEnd: roundData.finalCards
		});
	}

	resultsCallback = (resultsData) => {
		if(this.state.gameWinner!==null && resultsData===true) {
			this.setState({
				gameStatus: 0,
				leavingGame: false
			});
			socket.send(JSON.stringify({'type':'playerIn'}));
      // socket.send(JSON.stringify({'type':'players'}));
		}
		else if(this.state.gameWinner===null && resultsData===true) {
			socket.send(JSON.stringify({'type':'ready'}));
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
					gameWinner={this.state.gameWinner} cardsAtRoundEnd={this.state.cardsAtRoundEnd} 
					gameCallback={this.resultsCallback} socket={socket}/>);
	}
}

export default Game;
