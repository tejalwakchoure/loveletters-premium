import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import './Game.css';
import Cards from './Cards.js';
import CardCarousel from './CardCarousel.js';
import PlayCard from './PlayCard.js';
import {Container, Row, Col} from 'react-bootstrap';
import socket from './socket-context'


class Round extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	opacity: 1,
		    cardToPlay: " ",
		    cardRemaining: " ",
		    discardMode: false,
		    currentPlayer: " ",
		    playStatus: " ",
		    results: {  //socket.player_points,
						"p1" : 0,
						"p2" : 0,
						"p3" : 0
					},
		    winner: "p1",
		    currentCards: {},
		    immune: [],
		    syco: [],
		    eliminated: [],
		    prevTurnMessage: " "
		};
	    this.selectCard = this.selectCard.bind(this);
	    this.discard = this.discard.bind(this);
	    this.endTurn = this.endTurn.bind(this);
	    this.playCardCallback = this.playCardCallback.bind(this);
	}
	
	componentWillMount() {

		socket.onmessage = (event) => {
	   		var obj = JSON.parse(event.data);
			console.log(obj)
			
			if(obj.type === 'turn') {
				this.setState({
					currentPlayer: obj.player, //player ID
					currentCards: obj.cards,
					immune: obj.immune,
				    syco: obj.sycho,
				    eliminated: obj.eliminated,
				    prevTurnMessage: obj.prevTurn,
				    playStatus: {this.props.all_players[obj.player]}+" is playing"
				});
			}else if(obj.type === 'next'){//This has been added just to test going to next turn and to play a round
				socket.send(JSON.stringify({'type':'ready'}));
			}
	   	}
	   	
		socket.send(JSON.stringify({'type':'ready'}));
	    console.log('sent ready')
	}

	selectCard(chosen, remaining) {
		this.setState({
			cardToPlay: chosen,
			cardRemaining: remaining,
			opacity: 0.9 
		});
    	console.log('Clicked ' + this.state.cardToPlay);
  	}

  	discard = () => {
  		this.setState({
			discardMode: true
		});
  		console.log('Discarding ' + this.state.cardToPlay);
  	}

  	endTurn = () => {
  		this.setState({
			discardMode: false
		},
		socket.send(JSON.stringify({'type':'ready'})));
  		console.log('sent ready for next turn');
  	}

  	playCardCallback = (playCardData) => {
  		// this.setState({
  		// 	results: playCardData, //check if round is over based on backend logic
  		// 	winner: "p1", //check who won; if no one yet, keep blank
  		// });
  		if(playCardData.winner!==null) {
			this.props.gameCallback(playCardData.winner);
		}
		else {
			this.endTurn();
		} 
  	}

	render() {
		console.log('user = '+this.props.userID);
		console.log('currentPlayer = '+this.state.currentPlayer);
		console.log(this.state.currentCards);

		var currentCard = this.state.currentCards[0];
		if(currentCard===undefined)
			currentCard="loading_card" // before first render
		
		if(this.props.userID === this.state.currentPlayer) {
			console.log(this.props.username+ 'is playing');
			var drawnCard = this.state.currentCards[1];
			if(drawnCard===undefined)
				drawnCard="loading_card" // before first render
			
			if(this.state.discardMode) {
				return(
					<Container className="Game-header">
					  	<Row>
					  		<CardCarousel addCard={this.state.cardToPlay}/>
					  	</Row>
					  	<Row>
					  		<h4 className='Play-status'>{this.state.playStatus}</h4>
					  	</Row>
					  		<PlayCard currentPlayer={this.props.userID}
					  		cardPlayed={this.state.cardToPlay} cardRemaining={this.state.cardRemaining} 
					  		roundCallback={this.playCardCallback} all_players={this.props.all_players}
					  		immune={this.state.immune} syco={this.state.syco} eliminated={this.state.eliminated} />
					</Container>
				);
			}
			else {
				return(
					<Container className="Game-header">
					  	<Row>
					  		<CardCarousel addCard={" "}/>
					  	</Row>
					  	<Row>
					  		{this.state.prevTurnMessage!==null?
					  			<h5 className='Play-status'>{this.state.prevTurnMessage}</h5>: <div></div>}
					  	</Row>
					  	<Row>
					  		<h4 className='Play-status'>{this.state.playStatus}</h4>
					  	</Row>
					  	<Row>
					  		<Col style={{display: "inline-flex"}} onClick={(e) => this.selectCard(currentCard, drawnCard, e)}>
					  			<Cards cardname={currentCard}/>
					  		</Col>
					  		<Col style={{display: "inline-flex"}} onClick={(e) => this.selectCard(drawnCard, currentCard, e)}>
					  			<Cards cardname={drawnCard}/>
					  		</Col>
					  	</Row> 
					  	<Row style={{width: '50vw'}}> 
					  		<Button size="lg" block className='Confirm-button' disabled={this.state.cardToPlay===" "} onClick={this.discard}>Discard</Button>
					  	</Row>
					</Container>
				);
			}
		} else {
			return(
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel addCard={" "}/>
				  	</Row>
				  	<Row>
				  		{this.state.prevTurnMessage!==null?
				  			<h5 className='Play-status'>{this.state.prevTurnMessage}</h5>: <div></div>}
				  	</Row>
				  	<Row>
				  		<h4 className='Play-status'>{this.state.playStatus}</h4>
				  	</Row>
				  	<Row>
				  		<h3 className='Play-status'>It's not your turn</h3>
				  	</Row>
				  	<Row style={{marginBottom: '20px'}}>
				  		<Col style={{display: "inline-flex"}}>
				  			<Cards cardname={currentCard}/>
				  		</Col>
				  	</Row>
				</Container>
			);
		}
	}
}

export default Round;
