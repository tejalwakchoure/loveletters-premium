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
		    num_special: [],
		    prevTurnMessage: " ",
		    discard_pile: [],
		    num_cards_left: 32,
		    cardinalChosen: null,
		    disableButton: false,
		    turnEnded: false,
		    othersPlayMode: -1,
		    // cardinalChosenMessage: "",
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
			currentPlayer: obj.player,
			currentCards: obj.cards,
			allPlayerInfo: obj.playerInfo,
			num_special: obj.num_special,
		    prevTurnMessage: obj.prevTurn,
		    discard_pile: obj.discard_pile,
		    num_cards_left: obj.cards_left,
		    playStatus: this.props.all_players[obj.player]+" is playing",
		    disableButton: false,
  			// cardinalChosenMessage: ""
		});
	}

	getPlay(obj) {
		this.setState({
			othersPlayMode: obj.playMode,
			showPlay: obj.showPlay
		});
	}

	getResults(obj) {
		if(obj.roundWinner!==null && obj.discard_pile===[])
			this.setState({turnEnded: true});
		if(obj.gameWinner!==null)
			this.setState({turnEnded: true});
		this.setState({
  			playMode: 2,
  			othersPlayMode: -1,
  			results: obj,
  			discard_pile: obj.discard_pile,
  			num_cards_left: obj.cards_left
		},
		console.log("got results from socket"));
	}

	getCardinalView(obj) {
		const res = this.state.results;
		res['resultMsg'] = res['resultMsg']+"."+obj.cardinalChosenMessage;
		this.setState({
			// cardinalChosenMessage: obj.cardinalChosenMessage,
			results: res
		});
	}

	selectCard(chosen) {
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
			this.setState({
				cardinalChosen: this.state.results.card1,
				// cardinalChosenMessage: this.props.all_players[this.state.currentPlayer]+" viewed "+this.props.all_players[this.state.results.player1]+"'s card"
			});
			this.props.socket.send(JSON.stringify({'type':'cardinalView',
										    		'cardinalChosenMessage': this.props.all_players[this.state.currentPlayer]+" viewed "+this.props.all_players[this.state.results.player1]+"'s card"}));
		}
		else {
			this.setState({
				cardinalChosen: this.state.results.card2,
				// cardinalChosenMessage: this.props.all_players[this.state.currentPlayer]+" viewed "+this.props.all_players[this.state.results.player2]+"'s card"
			});
			this.props.socket.send(JSON.stringify({'type':'cardinalView',
							    					'cardinalChosenMessage': this.props.all_players[this.state.currentPlayer]+" viewed "+this.props.all_players[this.state.results.player2]+"'s card"}));
		
		}
	}

  	endTurn = () => {
  		if(this.state.results.roundWinner!==null) {
  			console.log("sent results to Game")
			this.props.gameCallback(this.state.results); //end round
		}
		else if(this.state.results.gameWinner!==null) {
			console.log("sent results to Game")
			this.props.gameCallback(this.state.results); //end round
		}
  	}

  	endTurnByButton = () => {
  		this.setState({turnEnded: true});
  		if(this.state.results.roundWinner===null) {
			this.props.socket.send(JSON.stringify({'type':'nextTurn'}));
  		}
  		this.endTurn()
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
				console.log('RENDER MODE: current player x choosing card')
				return(
					<Container className="Game-header">
					  	<Row style={{margin: 0}}>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} currentPlayer={this.state.currentPlayer}/>
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
					  		<Col style={{display: "inline-flex", justifyContent: 'center'}} onClick={(e) => this.selectCard(currentCard, e)}>
					  			<Cards cardname={currentCard}/>
					  		</Col>
					  		<Col style={{display: "inline-flex", justifyContent: 'center'}} onClick={(e) => this.selectCard(drawnCard, e)}>
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
					  	<Row style={{margin: '0px auto'}}>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} currentPlayer={this.state.currentPlayer}/>
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
				console.log('RENDER MODE: current player x results')
				return (
					<Container className="Game-header">
					  	<Row style={{margin: '0px auto'}}>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} currentPlayer={this.state.currentPlayer}/>
					  	</Row>
						<Row style={{margin: '0px auto'}}>
							<h5 className='Play-status'>{this.state.results.statusMsg}.</h5>
							<h5 className='Play-status'>{this.state.results.resultMsg}</h5>
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
					        <hr/>
					        <Row style={{margin: '1px auto 1px auto'}}>
					        	<ToggleButtonGroup type="radio" name="options" defaultValue={null} onChange={this.handleCardinalDiscard}>
					            	<ToggleButton value={1} size="lg"  className='Confirm-button' style={{width: '20vw'}} disabled={this.state.disableButton}>
					            					{this.props.all_players[this.state.results.player1]}</ToggleButton>
					            	<ToggleButton value={2} size="lg"  className='Confirm-button' style={{width: '20vw'}} disabled={this.state.disableButton}>
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
		
		else if(this.state.othersPlayMode===1) {
			console.log('RENDER MODE: other player x viewing play card')
				return(
					<Container className="Game-header">
					  	<Row style={{margin: '0px auto'}}>
					  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} currentPlayer={this.state.currentPlayer}/>
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
			console.log('RENDER MODE: one of the players involved in the turn x results')
			if(this.state.turnEnded)
				this.endTurn();
			if(!this.state.results.bishopGuess) {
				return (
				<Container className="Game-header">
				  	<Row style={{margin: '0px auto'}}>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} currentPlayer={this.state.currentPlayer}/>
				  	</Row>
					<Row style={{margin: '0px auto'}}>
						<h5 className='Play-status'>{this.state.results.statusMsg}.</h5>
						<h5 className='Play-status'>{this.state.results.resultMsg}</h5>
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
				  	<Row style={{margin: '0px auto'}}>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} currentPlayer={this.state.currentPlayer}/>
				  	</Row>
					<Row style={{margin: '0px auto'}}>
						<h5 className='Play-status'>{this.state.results.statusMsg}.</h5>
						<h5 className='Play-status'>{this.state.results.resultMsg}</h5>
					</Row>
					<hr/>
					<Row style={{margin: 'auto'}}>
						<h3 className='Play-status'>Discard this card?</h3>
					</Row>
					<hr/>
					<Row style={{margin: '1px auto auto auto'}}>
						<ToggleButtonGroup type="radio" name="options" defaultValue={null} onChange={this.handleBishopDiscard}>
			            	<ToggleButton value={true} size="lg"  className='Confirm-button' style={{width: '20vw'}} disabled={this.state.disableButton}>Yes</ToggleButton>
			            	<ToggleButton value={false} size="lg"  className='Confirm-button' style={{width: '20vw'}} disabled={this.state.disableButton}>No</ToggleButton>
			          	</ToggleButtonGroup>
					</Row>
				</Container>);
			}
		} 
		else {
			console.log('RENDER MODE: other players/one of the players involved in the turn')
			console.log("playMode=--------------", this.state.playMode)
			if(this.state.turnEnded)
				this.endTurn();
			return(
				<Container className="Game-header">
				  	<Row style={{margin: '0px auto'}}>
				  		<CardCarousel allCardsDiscarded={this.state.discard_pile} num_cards_left={this.state.num_cards_left}
					  						all_players={this.props.all_players} currentPlayer={this.state.currentPlayer}/>
				  	</Row>
		  			{this.state.playMode===2?
		  				(<div style={{margin: '0px auto'}}>
			  				<Row style={{margin: 'auto'}}>
								<h5 className='Play-status'>{this.state.results.statusMsg}.</h5>
								<h5 className='Play-status'>{this.state.results.resultMsg}</h5>
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
