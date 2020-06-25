import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import './Game.css';
import Cards from './Cards.js';
import CardCarousel from './CardCarousel.js';
import PlayCard from './PlayCard.js';
import ShowPlay from './ShowPlay.js';
import {Container, Row, Col} from 'react-bootstrap';


class Round extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
		    cardToPlay: " ",
		    playMode: 0, // 0-choosing card, 1-playing card, 2-viewing results of turn
		    currentPlayer: " ",
		    playStatus: " ",
		    results: {},
		    currentCards: [],
		    allPlayerInfo: {},
		    order: [],
		    num_special: [],
		    prevTurnMessage: " ",
		    discard_pile: [],
		    num_cards_left: 32,
		    cardinalChosen: null,
		    disableButton: false,
		    turnEnded: false,
		    othersPlayMode: -1,
		    showPlay: {}
		};

	    this.getTurn = this.getTurn.bind(this);
	    this.getPlay = this.getPlay.bind(this);
	    this.getResults = this.getResults.bind(this);
	    this.getCardinalView = this.getCardinalView.bind(this);
	    this.selectCard = this.selectCard.bind(this);
	    this.discard = this.discard.bind(this);
	    this.endTurn = this.endTurn.bind(this);
	    this.endTurnByButton = this.endTurnByButton.bind(this);
	    this.playCardCallback = this.playCardCallback.bind(this);
	    this.handleBishopDiscard = this.handleBishopDiscard.bind(this);
	    this.handleCardinalDiscard = this.handleCardinalDiscard.bind(this);

		this.props.socket.send(JSON.stringify({'type':'nextRound'}));
	}
	
	getTurn(obj) {
		this.setState({
			playMode: 0, // start new turn
			othersPlayMode: -1,
			currentPlayer: obj.player,
			currentCards: obj.cards,
			allPlayerInfo: obj.playerInfo,
			order: obj.order,
			num_special: obj.num_special,
		    prevTurnMessage: obj.prevTurn,
		    discard_pile: obj.discard_pile,
		    num_cards_left: obj.cards_left,
		    playStatus: this.props.all_players[obj.player]+" is playing",
		    disableButton: false
		});
	}

	getPlay(obj) {
		this.setState({
			othersPlayMode: obj.playMode,
			showPlay: obj.showPlay
		});
	}

	getResults(obj) {
		if(obj.roundWinner!==null || obj.gameWinner!==null) {
			this.setState({turnEnded: true});
			this.props.gameCallback(obj);
		}

		this.setState({
  			playMode: 2,
  			othersPlayMode: -1,
  			results: obj,
  			discard_pile: obj.discard_pile,
  			num_cards_left: obj.cards_left,
			currentPlayer: obj.player
		});
	}

	getCardinalView(obj) {
		const res = this.state.results;
		if(res['resultMsg']!=='')
			res['resultMsg'] = res['resultMsg']+". "+obj.cardinalChosenMessage;
		else
			res['resultMsg'] = res['resultMsg']+obj.cardinalChosenMessage;
		this.setState({results: res});
	}

	selectCard(chosen, mustPlay) {
		if(mustPlay!==null)
			chosen = mustPlay;
		this.setState({
			cardToPlay: chosen
		});
  	}

  	discard = () => {
  		if(this.state.currentCards.indexOf(this.state.cardToPlay)>=0) {
	  		this.setState({
				playMode: 1,
				discard_pile: this.state.discard_pile.concat(this.state.cardToPlay),
				num_cards_left: this.state.num_cards_left - 1
			});
		}
  	}

  	handleBishopDiscard = (toDiscard) => {
	    this.setState({disableButton: true});
	    this.props.socket.send(JSON.stringify({
	    	'type':'bishopDiscard',
	    	'toDiscard': toDiscard
	    }));
	    if(toDiscard){
	    	this.setState({
	    		discard_pile: this.state.discard_pile.concat(this.state.currentCards[0]),
	    		num_cards_left: this.state.num_cards_left - 1
	    	});
	    }
	}

	handleCardinalDiscard = (playerChosen) => {
		this.setState({disableButton: true});
		if(playerChosen===1) {
			this.setState({cardinalChosen: this.state.results.card1});
			this.props.socket.send(JSON.stringify({'type':'cardinalView',
								'cardinalChosenMessage': this.props.all_players[this.state.currentPlayer]+" viewed "+this.props.all_players[this.state.results.player1]+"'s card"}));
		}
		else {
			this.setState({cardinalChosen: this.state.results.card2});
			this.props.socket.send(JSON.stringify({'type':'cardinalView',
							    	'cardinalChosenMessage': this.props.all_players[this.state.currentPlayer]+" viewed "+this.props.all_players[this.state.results.player2]+"'s card"}));
		
		}
	}

  	endTurn = () => {
  		if(this.state.results.roundWinner!==null) {
			this.props.gameCallback(this.state.results); //end round
		}
		else if(this.state.results.gameWinner!==null) {
			this.props.gameCallback(this.state.results); //end round
		}
  	}

  	endTurnByButton = () => {
  		this.setState({turnEnded: true});
  		if(this.state.results.roundWinner===null) {
			this.props.socket.send(JSON.stringify({'type':'nextTurn'}));
  		}
  		this.endTurn();
  	}

  	playCardCallback = (playCardData) => {
  		this.props.socket.send(JSON.stringify(playCardData));
  	}

	render() {
		var currentCard = this.state.currentCards[0];
		if(currentCard===undefined)
			currentCard="loading_card" // before first render
		
		if(this.props.userID === this.state.currentPlayer) {
			var drawnCard = this.state.currentCards[1];
			if(drawnCard===undefined)
				drawnCard="loading_card" // before first render
			
			if(this.state.playMode===0) {

				const checkCountessArray = ['King', 'Prince'];
				var isCountess = null;
				if(currentCard==='Countess' && checkCountessArray.indexOf(drawnCard)>=0)
					isCountess = currentCard;
				if(drawnCard==='Countess' && checkCountessArray.indexOf(currentCard)>=0)
					isCountess = drawnCard;

				return(
					<Container className="Game-header">
					  	<Row style={{margin: '0 0 5px 0'}}>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} order={this.state.order} currentPlayer={this.state.currentPlayer}/>
					  	</Row>
					  	{this.state.prevTurnMessage!==null?
					  		(<div style={{margin: '0px auto'}}>
						  		<Row style={{margin: 'auto'}}>
						  			<h5 className='Play-status'>{this.state.prevTurnMessage}</h5>
						  		</Row>
						  		<hr/>
						  	</div>): <div></div>}
					  	<Row style={{margin: '0px auto'}}>
					  		<h4 className='Play-status'>{this.state.playStatus}</h4>
					  	</Row>
					  	<hr/>
					  	<Row style={{margin: 'auto'}}>
					  		<Col style={{display: "inline-flex", justifyContent: 'center'}} 
					  				onClick={(e) => this.selectCard(currentCard, isCountess, e)}>
					  				<Cards cardname={currentCard} toDisable={(isCountess!==null)?(isCountess===drawnCard):false}/>
					  		</Col>
					  		<Col style={{display: "inline-flex", justifyContent: 'center'}} 
					  				onClick={(e) => this.selectCard(drawnCard, isCountess, e)}>
					  			<Cards cardname={drawnCard} toDisable={(isCountess!==null)?(isCountess===currentCard):false}/>
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
					  	<Row style={{margin: '0 0 5px 0'}}>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} order={this.state.order} currentPlayer={this.state.currentPlayer}/>
					  	</Row>
					  	<Row style={{margin: '0px auto'}}>
					  		<h4 className='Play-status'>{this.state.playStatus} {this.state.cardToPlay}</h4>
					  	</Row>
					  	<hr/>
				  		<PlayCard socket={this.props.socket} currentPlayer={this.state.currentPlayer}
				  		cardPlayed={this.state.cardToPlay} roundCallback={this.playCardCallback} 
				  		all_players={this.props.all_players} allPlayerInfo={this.state.allPlayerInfo} 
				  		num_special={this.state.num_special}/>
					</Container>
				);
			} 
			else {
				return (
					<Container className="Game-header">
					  	<Row style={{margin: '0 0 5px 0'}}>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} order={this.state.order} currentPlayer={this.state.currentPlayer}/>
					  	</Row>
						<Row style={{margin: '0px auto'}}>
							<h5 className='Play-status'>{this.state.results.statusMsg}. {this.state.results.resultMsg}</h5>
						</Row>
						<hr/>
						{this.state.cardToPlay!=='Cardinal'?
						(<Row style={{margin: 'auto'}}>
							{this.state.results.card1!==null?
								<Col style={{display: "inline-flex", justifyContent: 'center'}}>
									<Cards cardname={this.state.results.card1} toDisable={false}/>
								</Col>: <div></div>}
							{this.state.results.card2!==null?
								<Col style={{display: "inline-flex", justifyContent: 'center'}}>
									<Cards cardname={this.state.results.card2} toDisable={false}/>
								</Col>: <div></div>}
						</Row>):

						(<div style={{margin: 'auto'}}>
					        <Row style={{marginBottom: '15px'}}>
					            <h3 className='Play-status'>Whose hand do you wish to look at?</h3>
					        </Row>
					        <Row style={{margin: '1px auto'}}>
					        	<ToggleButtonGroup type="radio" name="options" defaultValue={null} onChange={this.handleCardinalDiscard}>
					            	<ToggleButton value={1} size="lg"  className='Confirm-button' style={{width: '20vw'}} disabled={this.state.disableButton}>
					            					{this.props.all_players[this.state.results.player1]}</ToggleButton>
					            	<ToggleButton value={2} size="lg"  className='Confirm-button' style={{width: '20vw'}} disabled={this.state.disableButton}>
					            					{this.props.all_players[this.state.results.player2]}</ToggleButton>
					        	</ToggleButtonGroup>
					        </Row>
					        <Row style={{margin: 'auto'}}>
								<Col style={{display: "inline-flex", justifyContent: 'center'}}>
									<Cards cardname={this.state.cardinalChosen} toDisable={false}/>
								</Col>
							</Row>
						</div>)}

						<Row style={{width: '50vw', paddingTop: '10px', margin: 'auto'}}> 
							<Button size="lg" block className='Confirm-button'
							onClick={this.endTurnByButton}>OK</Button>
						</Row>
					</Container>);
			}
		}
		
		else if(this.state.othersPlayMode===1) {
				return(
					<Container className="Game-header">
					  	<Row style={{margin: '0 0 5px 0'}}>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} order={this.state.order} currentPlayer={this.state.currentPlayer}/>
					  	</Row>
					  	<Row style={{margin: '0px auto'}}>
					  		<h4 className='Play-status'>{this.state.playStatus} {this.state.showPlay.cardPlayed}</h4>
					  	</Row>
					  	<hr/>
				  		<ShowPlay all_players={this.props.all_players} playCardData={this.state.showPlay}/>
					</Container>
				);
		}
		
		else if((this.props.userID === this.state.results.player1 || this.props.userID === this.state.results.player2) && this.state.playMode===2) {
			if(this.state.turnEnded)
				this.endTurn();
			if(!this.state.results.bishopGuess) {
				return (
				<Container className="Game-header">
				  	<Row style={{margin: '0 0 5px 0'}}>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} order={this.state.order} currentPlayer={this.state.currentPlayer}/>
				  	</Row>
					<Row style={{margin: '0px auto'}}>
						<h5 className='Play-status'>{this.state.results.statusMsg}. {this.state.results.resultMsg}</h5>
					</Row>
					<hr/>
					<Row style={{margin: 'auto'}}>
						{this.state.results.card1!==null?
							<Col style={{display: "inline-flex", justifyContent: 'center'}}>
								<Cards cardname={this.state.results.card1} toDisable={false}/>
							</Col>: <div></div>}
						{this.state.results.card2!==null?
							<Col style={{display: "inline-flex", justifyContent: 'center'}}>
								<Cards cardname={this.state.results.card2} toDisable={false}/>
							</Col>: <div></div>}
					</Row>
				</Container>);
			} else {
				return (
				<Container className="Game-header">
				  	<Row style={{margin: '0 0 5px 0'}}>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} order={this.state.order} currentPlayer={this.state.currentPlayer}/>
				  	</Row>
					<Row style={{margin: '0px auto'}}>
						<h5 className='Play-status'>{this.state.results.statusMsg}. {this.state.results.resultMsg}</h5>
					</Row>
					<hr/>
					<Row style={{marginBottom: '15px'}}>
						<h3 className='Play-status'>Discard this card?</h3>
					</Row>
					<Row style={{margin: '1px auto'}}>
						<ToggleButtonGroup type="radio" name="options" defaultValue={null} onChange={this.handleBishopDiscard}>
			            	<ToggleButton value={true} size="lg"  className='Confirm-button' style={{width: '20vw'}} disabled={this.state.disableButton}>Yes</ToggleButton>
			            	<ToggleButton value={false} size="lg"  className='Confirm-button' style={{width: '20vw'}} disabled={this.state.disableButton}>No</ToggleButton>
			          	</ToggleButtonGroup>
					</Row>
				</Container>);
			}
		} 
		else {
			if(this.state.turnEnded)
				this.endTurn();
			return(
				<Container className="Game-header">
				  	<Row style={{margin: '0 0 5px 0'}}>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} order={this.state.order} currentPlayer={this.state.currentPlayer}/>
				  	</Row>
		  			{this.state.playMode===2?
		  				(<div style={{margin: '0px auto'}}>
			  				<Row style={{margin: 'auto'}}>
								<h5 className='Play-status'>{this.state.results.statusMsg}. {this.state.results.resultMsg}</h5>
							</Row>
							<hr/>
						</div>): 
						(this.state.prevTurnMessage!==null?
				  			(<div style={{margin: '0px auto'}}>
					  			<Row style={{margin: 'auto'}}>
					  				<h5 className='Play-status'>{this.state.prevTurnMessage}</h5>
					  			</Row>
					  			<hr/>
					  		</div>): <div></div>)}
					<Row style={{margin: '0px auto'}}>
				  		<h4 className='Play-status'>{this.state.playStatus}</h4>
		  			</Row>
		  			<hr/>

				  	{(this.state.allPlayerInfo[this.props.userID]!==undefined) && (this.state.allPlayerInfo[this.props.userID][0]===true)?
				  		(<Row style={{margin: 'auto'}}>
					  			<h3 className='Play-status'>You have been eliminated</h3>
					  		</Row>):
					  	(<div style={{margin: 'auto'}}>
						  	<Row style={{marginBottom: '15px'}} >
						  		<h3 className='Play-status'>It's not your turn</h3>
						  	</Row>
						  	<Row style={{margin: 'auto'}}>
						  		<Col style={{display: "inline-flex", justifyContent: 'center'}}>
						  			<Cards cardname={currentCard} toDisable={false}/>
						  		</Col>
						  	</Row>
					  	</div>)}
				</Container>
			);
		}
	}
}

export default Round;
