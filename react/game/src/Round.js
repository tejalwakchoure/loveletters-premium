import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import './Game.css';
import Cards from './Cards.js';
import CardCarousel from './CardCarousel.js';
import PlayCard from './PlayCard.js';
import {Container, Row, Col} from 'react-bootstrap';


class Round extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
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
		    discard_pile: [],
		    cardinalChosen: null,
		    turnEnded: false
		};
	    this.getTurn = this.getTurn.bind(this);
	    this.getResults = this.getResults.bind(this);
	    this.selectCard = this.selectCard.bind(this);
	    this.discard = this.discard.bind(this);
	    this.endTurn = this.endTurn.bind(this);
	    this.endTurnByButton = this.endTurnByButton.bind(this);
	    this.playCardCallback = this.playCardCallback.bind(this);
	    this.handleBishopDiscard = this.handleBishopDiscard.bind(this);
	    this.handleCardinalDiscard = this.handleCardinalDiscard.bind(this);

		this.props.socket.send(JSON.stringify({'type':'nextRound'}));
    	console.log('sent nextRound for @'+this.props.username)
	}
	
	getTurn(obj) {
		this.setState({
			playMode: 0, // start new turn
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
		if(obj.roundWinner!==null && obj.discard_pile===[])
			this.setState({turnEnded: true});
		if(obj.gameWinner!==null)
			this.setState({turnEnded: true});
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
		});
  	}

  	discard = () => {
  		this.setState({
			playMode: 1,
			discard_pile: this.state.discard_pile.concat(this.state.cardToPlay)
		});
  		console.log(this.props.all_players[this.state.currentPlayer]+' is discarding ' + this.state.cardToPlay);
  	}

  	handleBishopDiscard = (toDiscard) => {
	    console.log("Bishoped card discard? " + toDiscard);
	    if(toDiscard)
	    	this.props.socket.send(JSON.stringify({'type':'bishopDiscard'}));
	}

	handleCardinalDiscard = (playerChosen) => {
		if(playerChosen===1)
			this.setState({cardinalChosen: this.state.results.card1});
		else
			this.setState({cardinalChosen: this.state.results.card2});
	}

  	endTurn = () => {
  		if(this.state.results.roundWinner!==null) {
  			console.log('We have a round winner');
			this.props.gameCallback(this.state.results); //end round
			console.log('Round winner sent to Game');
		}
		else if(this.state.results.gameWinner!==null) {
  			console.log('We have a game winner');
			this.props.gameCallback(this.state.results); //end round
			console.log('Game winner sent to Game');
		}
  	}

  	endTurnByButton = () => {
  		this.setState({turnEnded: true});
  		if(this.state.results.roundWinner===null) {
  			console.log('No round winner yet')
			this.props.socket.send(JSON.stringify({'type':'nextTurn'}));
	  		console.log('sent nextTurn for @'+this.props.username);
  		}
  	}

  	playCardCallback = (playCardData) => {
  		this.props.socket.send(JSON.stringify(playCardData));
	    console.log('sent played values from Round for @'+this.props.username);
  	}

	render() {
		console.log('user = '+this.props.userID);
		console.log('currentPlayer = '+this.state.currentPlayer);
		console.log(this.state.currentCards);

		var currentCard = this.state.currentCards[0];
		if(currentCard===undefined)
			currentCard="loading_card" // before first render
		
		if(this.props.userID === this.state.currentPlayer) {
			if(this.state.turnEnded)
				this.endTurn();
			console.log(this.props.username+ 'is playing');
			var drawnCard = this.state.currentCards[1];
			if(drawnCard===undefined)
				drawnCard="loading_card" // before first render

			if(this.state.playMode===0) {
				console.log('RENDER MODE: current player x choosing card')
				return(
					<Container className="Game-header">
					  	<Row>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
					  	</Row>
					  	<Row style={{margin: 'auto'}}>
					  		{this.state.prevTurnMessage!==null?
					  			<h5 className='Play-status'>{this.state.prevTurnMessage}</h5>: <div></div>}
					  	</Row>
					  	<hr/>
					  	<Row style={{margin: 'auto'}}>
					  		<h4 className='Play-status'>{this.state.playStatus}</h4>
					  	</Row>
					  	<hr/>
					  	<Row style={{margin: 'auto'}}>
					  		<Col style={{display: "inline-flex", justifyContent: 'center'}} onClick={(e) => this.selectCard(currentCard, drawnCard, e)}>
					  			<Cards cardname={currentCard}/>
					  		</Col>
					  		<Col style={{display: "inline-flex", justifyContent: 'center'}} onClick={(e) => this.selectCard(drawnCard, currentCard, e)}>
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
				console.log('RENDER MODE: current player x playing card')
				return(
					<Container className="Game-header">
					  	<Row>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
					  	</Row>
					  	<Row style={{margin: 'auto'}}>
					  		<h4 className='Play-status'>{this.state.playStatus}</h4>
					  	</Row>
					  	<hr/>
				  		<PlayCard currentPlayer={this.state.currentPlayer}
				  		cardPlayed={this.state.cardToPlay} cardRemaining={this.state.cardRemaining} 
				  		roundCallback={this.playCardCallback} all_players={this.props.all_players}
				  		immune={this.state.immune} syco={this.state.syco} eliminated={this.state.eliminated}/>
					</Container>
				);
			} 
			else {
				console.log('RENDER MODE: current player x results')
				return (
					<Container className="Game-header">
					  	<Row>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
					  	</Row>
						<Row style={{margin: 'auto'}}>
							<h4 className='Play-status'>{this.state.results.statusMsg}</h4>
						</Row>
						<hr/>
						<Row style={{margin: 'auto'}}>
							<h3 className='Play-status'>{this.state.results.resultMsg}</h3>
						</Row>
						<hr/>
						
						{this.state.cardToPlay!=='Cardinal'?
						(<Row style={{margin: 'auto'}}>
							{this.state.results.card1!==null?
								<Col style={{display: "inline-flex", justifyContent: 'center'}}><Cards cardname={this.state.results.card1}/></Col>: <div></div>}
							{this.state.results.card2!==null?
								<Col style={{display: "inline-flex", justifyContent: 'center'}}><Cards cardname={this.state.results.card2}/></Col>: <div></div>}
						</Row>):

						(<div style={{margin: 'auto'}}>
					        <Row style={{margin: 'auto'}}>
					            <h3 className='Play-status'>Whose hand do you wish to look at?</h3>
					        </Row>
					        <Row style={{margin: '1px auto 1px auto'}}>
					        	<ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={this.handleCardinalDiscard}>
					            	<ToggleButton value={1} size="lg"  className='Confirm-button' style={{width: '20vw'}}>
					            					{this.props.all_players[this.state.results.player1]}</ToggleButton>
					            	<ToggleButton value={2} size="lg"  className='Confirm-button' style={{width: '20vw'}}>
					            					{this.props.all_players[this.state.results.player2]}</ToggleButton>
					        	</ToggleButtonGroup>
					        </Row>
					        <Row style={{margin: 'auto'}}>
								<Col style={{display: "inline-flex", justifyContent: 'center'}}><Cards cardname={this.state.cardinalChosen}/></Col>
							</Row>
						</div>)}

						<Row style={{width: '50vw', paddingTop: '10px', margin: 'auto'}}> 
							<Button size="lg" block className='Confirm-button'
							onClick={this.endTurnByButton}>OK</Button>
						</Row>
					</Container>);
			}
		}
		else if((this.props.userID === this.state.results.player1 || this.props.userID === this.state.results.player2) && this.state.playMode===2) {
			console.log('RENDER MODE: one of the players involved in the turn x results')
			if(this.state.turnEnded)
				this.endTurn();
			if(!this.state.results.bishopGuess) {
				return (
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
				  	</Row>
					<Row style={{margin: 'auto'}}>
						<h4 className='Play-status'>{this.state.results.statusMsg}</h4>
					</Row>
					<hr/>
					<Row style={{margin: 'auto'}}>
						<h3 className='Play-status'>{this.state.results.resultMsg}</h3>
					</Row>
					<hr/>
					<Row style={{margin: 'auto'}}>
						{this.state.results.card1!==null?
							<Col style={{display: "inline-flex", justifyContent: 'center'}}><Cards cardname={this.state.results.card1}/></Col>: <div></div>}
						{this.state.results.card2!==null?
							<Col style={{display: "inline-flex", justifyContent: 'center'}}><Cards cardname={this.state.results.card2}/></Col>: <div></div>}
					</Row>
				</Container>);
			} else {
				return (
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
				  	</Row>
					<Row style={{margin: 'auto'}}>
						<h4 className='Play-status'>{this.state.results.statusMsg}</h4>
					</Row>
					<hr/>
					<Row style={{margin: 'auto'}}>
						<h3 className='Play-status'>{this.state.results.resultMsg}</h3>
					</Row>
					<hr/>
					<Row style={{margin: 'auto'}}>
						<h3 className='Play-status'>Discard this card?</h3>
					</Row>
					<Row style={{margin: '1px auto auto auto'}}>
						<ToggleButtonGroup type="radio" name="options" defaultValue={false} onChange={this.handleBishopDiscard}>
			            	<ToggleButton value={true} size="lg"  className='Confirm-button' style={{width: '20vw'}}>Yes</ToggleButton>
			            	<ToggleButton value={false} size="lg"  className='Confirm-button' style={{width: '20vw'}}>No</ToggleButton>
			          	</ToggleButtonGroup>
					</Row>
				</Container>);
			}
		} 
		else {
			console.log('RENDER MODE: other players/one of the players involved in the turn x playmode!=2')
			if(this.state.turnEnded)
				this.endTurn();
			return(
				<Container className="Game-header">
				  	<Row>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile}/>
				  	</Row>
			  		{this.state.playMode===2?
			  				(<div style={{margin: 'auto'}}>
					  			<Row style={{margin: 'auto'}}>
									<h4 className='Play-status'>{this.state.results.statusMsg}</h4>
								</Row>
								<hr/>
								<Row style={{margin: 'auto'}}>
									<h3 className='Play-status'>{this.state.results.resultMsg}</h3>
								</Row>
								<hr/>
							</div>):
							(this.state.prevTurnMessage!==null?
					  			(<div style={{margin: 'auto'}}>
						  			<Row style={{margin: 'auto'}}>
						  				<h5 className='Play-status'>{this.state.prevTurnMessage}</h5>
						  			</Row>
						  			<hr/>
						  		</div>): <div></div>)}
					  	

				  	{this.state.eliminated.indexOf(this.props.userID)>=0?
				  		(<div style={{margin: 'auto'}}>
				  			<Row style={{margin: 'auto'}}>
					  			<h3 className='Play-status'>You have been eliminated</h3>
					  		</Row>
					  		<hr/>
					  	</div>):
					  	(<div style={{margin: 'auto'}}>
						  	<Row style={{margin: 'auto'}} >
						  		<h3 className='Play-status'>It's not your turn</h3>
						  	</Row>
						  	<hr/>
						  	<Row style={{margin: 'auto'}}>
						  		<Col style={{display: "inline-flex", justifyContent: 'center'}}>
						  			<Cards cardname={currentCard}/>
						  		</Col>
						  	</Row>
					  	</div>)}
				</Container>
			);
		}
	}
}

export default Round;
