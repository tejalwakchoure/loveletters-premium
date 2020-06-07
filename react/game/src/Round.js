import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import './Game.css';
import Cards from './Card.js';
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
		    discardMode: false,
		    currentPlayer: "p1",
		    playStatus: "p1"+" is discarding",
		};
	    this.selectCard = this.selectCard.bind(this);
	    this.discard = this.discard.bind(this);
	    this.endRound = this.endRound.bind(this);
	}

	drawCard() {
		const drawn = Values.draw_pile[0];
		console.log(Values.draw_pile.splice(0, 0));
		return drawn;
	}

	selectCard(id) {
		this.setState({
			cardToPlay: id,
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

  	endRound = () => {
  		this.setState({
			discardMode: false
		});
  		console.log('Ending Round');
  	}

	render() {
		const currentCard = Values.current_cards[this.state.currentPlayer];
		const drawnCard = this.drawCard();
		if(this.state.discardMode) {
			return(
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel/>
				  	</Row>
				  	<Row>
				  		<h4 className='Play-status'>{this.state.playStatus}</h4>
				  	</Row>
				  	<Row>
				  		<PlayCard cardPlayed={this.state.cardToPlay}/>
				  	</Row> 
				  	<Row style={{width: '50vw'}}> 
				  		<Button size="lg" block className='Confirm-button' onClick={this.endRound}>OK</Button>
				  	</Row>
				</Container>
			);
		} 
		else {
			return(
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel/>
				  	</Row>
				  	<Row>
				  		<h4 className='Play-status'>{this.state.playStatus}</h4>
				  	</Row>
				  	<Row>
				  		<Col style={{display: "inline-flex"}} onClick={(e) => this.selectCard(currentCard, e)}>
				  			<Cards cardname={currentCard}/>
				  		</Col>
				  		<Col style={{display: "inline-flex"}} onClick={(e) => this.selectCard(drawnCard, e)}>
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
