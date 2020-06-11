import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import './Game.css';
import Cards from './Cards.js';
import CardCarousel from './CardCarousel.js';
import PlayCard from './PlayCard.js';
import {Container, Row, Col} from 'react-bootstrap';


class Round extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	opacity: 1,
		    cardToPlay: " ",
		    cardRemaining: " ",
		    playMode: 0, // 0-choosing card, 1-playing card, 2-viewing results of turn
		    currentPlayer: " ",
		    playStatus: " ",
		    results: {},
		    currentCards: [],
		    immune: [],
		    syco: [],
		    eliminated: [],
		    prevTurnMessage: " ",
		    discard_pile: []
		};
	    this.getTurn = this.getTurn.bind(this);
	    this.getResults = this.getResults.bind(this);
	    this.selectCard = this.selectCard.bind(this);
	    this.discard = this.discard.bind(this);
	    this.endTurn = this.endTurn.bind(this);
	    this.playCardCallback = this.playCardCallback.bind(this);

	    this.props.socket.send(JSON.stringify({'type':'ready'}));
	    console.log('sent ready')
	}
	
	getTurn(obj) {
		this.setState({
			currentPlayer: obj.player,
			currentCards: obj.cards,
			immune: obj.immune,
		    syco: obj.sycho,
		    eliminated: obj.eliminated,
		    prevTurnMessage: obj.prevTurn,
		    playStatus: this.props.all_players[obj.player]+" is playing"
		});
	}

	getResults(obj) {
		this.setState({
  			playMode: 2,
  			results: obj,
  			discard_pile: obj.discard_pile
		});
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
			playMode: 1,
			discard_pile: this.state.discard_pile.concat(this.state.cardToPlay)
		});
  		console.log('Discarding ' + this.state.cardToPlay);
  	}

  	endTurn = () => {
  		if(this.state.results.round_winner!==undefined) {
			this.props.gameCallback(this.state.results); //end round
			console.log('sent results to Game.js');
		}
  		else {
  			this.setState({
				playMode: 0 // start new turn
			},
			this.props.socket.send(JSON.stringify({'type':'nextTurn'})));
	  		console.log('sent nextTurn for next turn');
  		}
  	}

  	playCardCallback = (playCardData) => {
  		this.props.socket.send(JSON.stringify(playCardData));
	    console.log('sent discard');
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
			
			if(this.state.playMode===0) {
				return(
					<Container className="Game-header">
					  	<Row>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
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
			else if(this.state.playMode===1) {
				return(
					<Container className="Game-header">
					  	<Row>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
					  	</Row>
					  	<Row>
					  		<h4 className='Play-status'>{this.state.playStatus}</h4>
					  	</Row>
					  		<PlayCard currentPlayer={this.state.currentPlayer}
					  		cardPlayed={this.state.cardToPlay} cardRemaining={this.state.cardRemaining} 
					  		roundCallback={this.playCardCallback} all_players={this.props.all_players}
					  		immune={this.state.immune} syco={this.state.syco} eliminated={this.state.eliminated}/>
					</Container>
				);
			} 
			else {
				return (
					<Container className="Game-header">
					  	<Row>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
					  	</Row>
						<Row>
							<h4 className='Play-status'>{this.state.results.statusMsg}</h4>
						</Row>
						<Row>
							<h3 className='Play-status'>{this.state.results.resultMsg}</h3>
						</Row>
						<Row>
							{this.state.results.card1!==null?
								<Col style={{display: "inline-flex"}}><Cards cardname={this.state.results.card1}/></Col>: <div></div>}
							{this.state.results.card2!==null?
								<Col style={{display: "inline-flex"}}><Cards cardname={this.state.results.card2}/></Col>: <div></div>}
						</Row>
						<Row style={{width: '50vw', paddingTop: '10px', margin: 'auto'}}> 
							<Button size="lg" block className='Confirm-button'
							onClick={this.endTurn}>OK</Button>
						</Row>
					</Container>);
			}
		} 
		else if (this.state.playMode===2 &&
					(this.props.userID === this.state.results.player1 || this.props.userID === this.state.results.player2)) {
			return (
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
				  	</Row>
					<Row>
						<h4 className='Play-status'>{this.state.results.statusMsg}</h4>
					</Row>
					<Row>
						<h3 className='Play-status'>{this.state.results.resultMsg}</h3> {/*what to show if eliminated??*/}
					</Row>
					<Row>
						{this.state.results.card1!==null?
							<Col style={{display: "inline-flex"}}><Cards cardname={this.state.results.card1}/></Col>: <div></div>}
						{this.state.results.card2!==null?
							<Col style={{display: "inline-flex"}}><Cards cardname={this.state.results.card2}/></Col>: <div></div>}
					</Row>
				</Container>);

		} 
		else {
			return(
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
				  	</Row>
				  	<Row>
				  		{this.state.prevTurnMessage!==null?
				  			<h5 className='Play-status'>{this.state.prevTurnMessage}</h5>: <div></div>}
				  	</Row>
				  	<Row>
				  		<h4 className='Play-status'>{this.state.playStatus}</h4>
				  	</Row>

				  	{this.state.eliminated.indexOf(this.props.userID)>=0?
				  		(<Row>
					  		<h3 className='Play-status'>You have been eliminated</h3>
					  	</Row>):
					  	(<div><Row>
					  		<h3 className='Play-status'>It's not your turn</h3>
					  	</Row>
					  	<Row style={{marginBottom: '20px'}}>
					  		<Col style={{display: "inline-flex"}}>
					  			<Cards cardname={currentCard}/>
					  		</Col>
					  	</Row></div>)}
				</Container>
			);
		}
	}
}

export default Round;
