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
			points: {},
			prevPoints: null,
			roundWinner: " ",
			gameWinner: " ",
			cardsAtRoundEnd: [],
			discardPileAtRoundEnd: [],
			userID: ' ',
			username: ' ',
			obj: {}
		};
		this.landingCallback = this.landingCallback.bind(this);
		this.roundCallback = this.roundCallback.bind(this);
		this.resultsCallback = this.resultsCallback.bind(this);
		
		this.landingRef = React.createRef();
		this.roundRef = React.createRef();

		const card_names = ['Bishop','Dowager Queen','Constable','Count','Sycophant','Baroness','Cardinal','Jester', 
     	                   	'Guard','Assassin','Princess','Countess','King','Prince','Handmaid','Baron','Priest'];
	   
	    new Image().src = require('../assets/cards/loading_card.jpeg');
	    new Image().src = require('../assets/cards/displayBlank.png');
	    card_names.map((img, index) => {new Image().src = require('../assets/cards/mini'+img+'.png')});
	    card_names.map((img, index) => {new Image().src = require('../assets/cards/'+img+'.jpeg')});    
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
			const set = this.setObjectValue(obj);
			if(set===false)
				this.setState({obj: obj});
	  	}
	}

	componentDidUpdate() {
		const set = this.setObjectValue(this.state.obj);
		if(set===true)
			this.setState({obj: {}});
	}

	setObjectValue(obj) {
		let set = false;
		if(obj.type === 'playersS'){
			if(this.landingRef.current!==null) {
				this.landingRef.current.getPlayers(obj);
				set=true;
			}
		}
		else if(obj.type === 'gameOptions'){
			if(this.landingRef.current!==null) {
				this.landingRef.current.getOptions(obj);
				set=true;
			}
		}
		else if(obj.type === 'startGame'){
			if(this.landingRef.current!==null) {
				this.landingRef.current.getStartGame(obj);
				set=true;
			}
		}
		else if(obj.type === 'turn'){
			if(this.roundRef.current!==null) {
				this.roundRef.current.getTurn(obj);
				set=true;
			}
		}
		else if(obj.type === 'playComponent'){
			if(this.roundRef.current!==null) {
				this.roundRef.current.getPlay(obj);
				set=true;
			}
		}
		else if(obj.type === 'results'){
			if(this.roundRef.current!==null) {
				this.roundRef.current.getResults(obj);
				set=true;
			}
		}
		else if(obj.type === 'cardinalView'){
			if(this.roundRef.current!==null) {
				this.roundRef.current.getCardinalView(obj);
				set=true;
			}
		}
		else if(obj.type === 'readyAll'){
			this.setState({gameStatus: 1});
			set=true;
		}
		else if(obj.type === 'redirect'){
			window.location.replace('/');
			set=true;
		}
		return set;
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
		let emptyPoints = {};
		Object.entries(this.state.all_players).map(([key,value]) => {emptyPoints[key] = []}); 

		this.setState({
			rounds_played: this.state.rounds_played + 1,
			points: (((roundData.tokens!==emptyPoints) && (roundData.tokens!==null) && 
							(roundData.tokens!==undefined))?roundData.tokens:this.state.points),
			gameStatus: 2,
			roundWinner: roundData.roundWinner,
			gameWinner: roundData.gameWinner,
			cardsAtRoundEnd: roundData.finalCards,
			discardPileAtRoundEnd: roundData.discard_pile
		});
	}

	resultsCallback = (resultsData) => {
		if(this.state.gameWinner!==null && resultsData===true) {
			this.setState({
				gameStatus: 0,
				leavingGame: false
			});
			socket.send(JSON.stringify({'type':'playerIn'}));
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
			return(<Results points={this.state.points} allPlayers={this.state.all_players} winner={this.state.roundWinner} 
					gameWinner={this.state.gameWinner} cardsAtRoundEnd={this.state.cardsAtRoundEnd}
					carousel={this.state.discardPileAtRoundEnd} gameCallback={this.resultsCallback} socket={socket}/>);
	}
}

export default Game;
