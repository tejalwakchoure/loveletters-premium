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
		    playStatus: "p1 is discarding",
		    results: {  //socket.player_points,
						"p1" : 0,
						"p2" : 0,
						"p3" : 0
					},
		    winner: "p1",
		    currentCards: {},
		    immune: [],
		    syco: [],
		    eliminated: []
		};
	    this.selectCard = this.selectCard.bind(this);
	    this.discard = this.discard.bind(this);
	    this.endPlay = this.endPlay.bind(this);
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
				    eliminated: obj.eliminated
				});
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

  	endPlay = () => {
  		this.setState({
			discardMode: false
		});
  		console.log('Ending Play');
  	}

  	playCardCallback = (playCardData) => {
  		this.setState({
  			results: playCardData, //check if round is over based on backend logic
  			winner: "p1", //check who won; if no one yet, keep blank
  		});
  		if(this.state.winner!==" ") {
			this.props.gameCallback(this.state.winner);
		}
		else {
			this.endPlay();
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
					  		immune={this.state.immune} syco={this.state.syco} elim={this.state.eliminated} />
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
				  		<h4 className='Play-status'>{this.state.playStatus}</h4>
				  	</Row>
				  	<Row>
				  		<h3 className='Play-status'>It's not your turn</h3>
				  	</Row>
				  	<Row>
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
