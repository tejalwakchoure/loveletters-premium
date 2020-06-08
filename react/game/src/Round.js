import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import './Game.css';
import Cards from './Cards.js';
import CardCarousel from './CardCarousel.js';
import PlayCard from './PlayCard.js';
import {Values} from '../assets/values.js';
import {Container, Row, Col} from 'react-bootstrap';


class Round extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	opacity: 1,
		    cardToPlay: " ",
		    cardRemaining: " ",
		    discardMode: false,
		    currentPlayer: "p1",
		    playStatus: "p1"+" is discarding",
		    results: Values.player_points,
		    winner: "p1"
		};
	    this.drawCard = this.drawCard.bind(this);
	    this.selectCard = this.selectCard.bind(this);
	    this.discard = this.discard.bind(this);
	    this.endPlay = this.endPlay.bind(this);
	    this.playCardCallback = this.playCardCallback.bind(this);
	}

	drawCard() {
		const drawn = Values.draw_pile[0];
		//drawCard();
		console.log(Values.draw_pile.splice(0, 0)); //check syntax
		return drawn;
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
  		if(this.state.winner!=" ") {
			this.props.gameCallback(this.state.winner);
		}
		else {
			this.endPlay();
		}
  	}

	render() {
		const currentCard = Values.current_cards[this.state.currentPlayer];
		const drawnCard = this.drawCard();
		console.log('in round');
		if(this.state.discardMode) {
			return(
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel addCard={this.state.cardToPlay}/>
				  	</Row>
				  	<Row>
				  		<h4 className='Play-status'>{this.state.playStatus}</h4>
				  	</Row>
				  		<PlayCard currentPlayer = {this.state.currentPlayer} cardPlayed={this.state.cardToPlay} cardRemaining={this.state.cardRemaining} roundCallback={this.playCardCallback}/>
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
				  		<Button size="lg" block className='Confirm-button' disabled={this.state.cardToPlay==" "} onClick={this.discard}>Discard</Button>
				  	</Row>
				</Container>
			);
		}
	}
}

export default Round;
