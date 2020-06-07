import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import './Game.css';
import Cards from './Card.js';
import CardCarousel from './CardCarousel.js';
import {Values} from '../assets/values.js';
import {Container, Row, Col} from 'react-bootstrap';


class Round extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	opacity: 1,
		    toDiscard: " ",
		    playStatus: "Player 1 is discarding"
		};
	    this.selectCard = this.selectCard.bind(this);
	    this.discard = this.discard.bind(this);
	 }

	selectCard(id) {
		this.setState({
			toDiscard: id,
			opacity: 0.9
		});
    	console.log('Clicked ' + this.state.toDiscard);
  	}

  	discard = () => {
  		console.log('Discarding ' + this.state.toDiscard);
  	}

	drawCard() {
		const drawn = Values.draw_pile[0];
		console.log(Values.draw_pile.splice(0, 0));
		return drawn;
	}

	render() {
		const currentCard = Values.current_cards[Values.current_player];
		const drawnCard = this.drawCard();
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
			  		<Button size="lg" block className='Discard-button' onClick={this.discard}>Discard</Button>
			  	</Row>
			</Container>
		);
	}
}

export default Round;
