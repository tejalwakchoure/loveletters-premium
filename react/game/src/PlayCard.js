import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Values} from '../assets/values.js';
import {Container, Row, Col} from 'react-bootstrap';

class PlayCard extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	selectedPlayers: [],
	    	selectionSatisfied: false,
	    	selectedCard: " "
	    }
	    this.selectPlayer = this.selectPlayer.bind(this);
	    this.selectCard = this.selectCard.bind(this);
		this.endPlay = this.endPlay.bind(this);
		this.getList = this.getList.bind(this);
	}

	selectPlayer(type, item){ 
		let selectedPlayers = null;
		let x = 0;
		if(type=='single') {
			selectedPlayers = [item];
			if(this.props.cardPlayed!="Guard")
				this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
			else
				this.setState({selectedPlayers: selectedPlayers});
		}
		else {
			if((x=this.state.selectedPlayers.indexOf(item))>=0) {
				selectedPlayers = this.state.selectedPlayers;
				selectedPlayers.splice(x, 1);	
			} else {
				selectedPlayers = this.state.selectedPlayers.concat(item);
			}
			
			if(type=='double') {
				if(selectedPlayers.length==2) {
						this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
				} else {
					this.setState({selectionSatisfied: false, selectedPlayers: selectedPlayers});
				}
			} else {
				if(selectedPlayers.length==1 || selectedPlayers.length==2) {
						this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
				} else {
					this.setState({selectionSatisfied: false, selectedPlayers: selectedPlayers});
				}
			}	
		}
		console.log('selected player:'+selectedPlayers)
	}
	selectCard(item) {
		this.setState({selectionSatisfied: true, selectedCard: item});
		console.log('selected card:'+item);
	}

	endPlay() {
		const valuesToSend = {};
		this.state.selectedPlayers.map((item, i) => {
			valuesToSend[item] = Values.current_cards[item]});
		valuesToSend[this.props.currentPlayer] = this.props.cardRemaining;
		
		if(this.props.cardPlayed=="Guard")
			valuesToSend["Guessed"] = this.state.selectedCard;
		console.log(valuesToSend);
		
		//getResult(valuesToSend);
		const results = {} //0 : no change (ex.Priest)
		results[this.state.selectedPlayer] = 1;//won
		results[this.props.currentPlayer] = -1;//lost and eliminated
		//display the result
		this.props.roundCallback(results);
	}

	getList() {
		//Eliminated?? ICON! Immune?? ICON!
		var list = null;
		if(["Assassin", "Constable", "Count", "Countess", "Handmaid", "Princess"].indexOf(this.props.cardPlayed)>=0) { //no action
			list = null;
			console.log('list is null');
		}
		
		else {
			var enableCurrent = (this.props.cardPlayed=="Prince" || this.props.cardPlayed=="Sycophant");
			var choiceType = "";
			
			if(this.props.cardPlayed=="Baroness") //one or two choices
				choiceType = "either";
			else if(this.props.cardPlayed=="Cardinal") // two choices
				choiceType = "double";
			else // single choice
				choiceType = "single";

	  		list = (<ListGroup>
  				{this.props.all_players.map((item, i) => {
					return <ListGroup.Item className='List-item-design'
								variant={this.state.selectedPlayers.indexOf(item)>=0?'dark':'light'}
								key={item}
								disabled={enableCurrent?false:(item==this.props.currentPlayer)}
								onClick={(e) => this.selectPlayer(choiceType, item, e)}>{item}
							</ListGroup.Item>})}
				</ListGroup>);  
	  	} 

		return list;
	}

	render() {
		const list = this.getList();
		const card_count = {
							"Assassin" : 1, 
							"Baron" : 2,
							"Baroness" : 2,
							"Bishop" : 1,
							"Cardinal" : 2,
							"Constable" : 1,
							"Count" : 2,
							"Countess" : 1,
							"Dowager Queen" : 1,
							"Guard" : 8, 
							"Handmaid" : 2,
							"Jester" : 1, 
							"King" : 1,
							"Priest" : 2, 
							"Prince" : 2,
							"Princess" : 1,
							"Sycophant" : 2
						};

		if(list!=null) {
			return (
				<div>
					<Row style={{justifyContent: 'center'}}>
						<Col>{list}</Col>
						{this.props.cardPlayed=="Guard"?
							<Col>
								<ListGroup>
					  				{Object.entries(card_count).map(([item, value]) => {
										return <ListGroup.Item className='List-item-design'
													variant={this.state.selectedCard==item?'dark':'light'}
													key={item} 
													disabled={item==this.props.cardPlayed}
													onClick={(e) => this.selectCard(item, e)}>{item}
													<Badge variant="secondary" style={{float: 'right'}}>{value}</Badge>
												</ListGroup.Item>})}
								</ListGroup>
							</Col>:
							<div>
							</div>}
					</Row>
					<Row style={{width: '50vw', paddingTop: '10px', margin: 'auto'}}> 
						<Button size="lg" block className='Confirm-button' 
						disabled={!this.state.selectionSatisfied}
						onClick={this.endPlay}>OK</Button>
					</Row>
				</div>
			);
		}
		else {
			return (<div>{this.endPlay()}</div>);
		}
	}
}

export default PlayCard;
