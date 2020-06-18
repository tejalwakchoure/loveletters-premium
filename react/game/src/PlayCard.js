import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShieldAlt, faHandshake, faSkull} from '@fortawesome/free-solid-svg-icons';

class PlayCard extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	selectedPlayers: this.props.syco,
	    	selectionSatisfied: false,
	    	selectedNumber: -1,
	    	num_disabled_players: this.props.immune.length + this.props.eliminated.length,
	    	num_players: Object.keys(this.props.all_players).length
	    }
	    this.selectPlayer = this.selectPlayer.bind(this);
	    this.selectNumber = this.selectNumber.bind(this);
		this.endPlay = this.endPlay.bind(this);
		this.getList = this.getList.bind(this);
		this.setDefaultSelection = this.setDefaultSelection.bind(this);

	}

	selectPlayer(type, item){ 
		let selectedPlayers = this.state.selectedPlayers;
		let x = 0;
		
		if(type==='single') {
			if(this.props.syco.length===0) //no sycophants; proceed as normal
				selectedPlayers = [item];
			
			if(this.props.cardPlayed!=="Guard" && this.props.cardPlayed!=="Bishop")
				this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
			else
				this.setState({selectionSatisfied: this.state.selectedNumber!==-1, selectedPlayers: selectedPlayers});
		}
		else {
			if(this.props.syco.length===0 || !(this.props.syco.indexOf(item)>=0)) { //this item is not a sycophant
				x = selectedPlayers.indexOf(item);
				if(x!==undefined && x>=0) {
					selectedPlayers.splice(x, 1);
				} else {
					selectedPlayers = selectedPlayers.concat(item);
				}
			}

			if(type==='double') {
				if(selectedPlayers.length===2) {
						this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
				} else {
					this.setState({selectionSatisfied: false, selectedPlayers: selectedPlayers});
				}
				
			} else { // type is 'either'
				if(selectedPlayers.length===1 || selectedPlayers.length===2) {
					this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
				} else {
					this.setState({selectionSatisfied: false, selectedPlayers: selectedPlayers});
				}
			}	
		}
	}

	selectNumber(item, defaultSelectionSatisfied) {
		console.log("this.state.selectedPlayers=", this.state.selectedPlayers)
		console.log("defaultSelectionSatisfied=", defaultSelectionSatisfied)
		this.setState({selectionSatisfied: (this.state.selectedPlayers.length>0), 
							selectedNumber: (defaultSelectionSatisfied)?-1:item});
	}

	endPlay() {
		const valuesToSend = {};
		valuesToSend['type'] = 'discard';
		valuesToSend['player'] = this.props.currentPlayer;
		valuesToSend['card'] = this.props.cardPlayed;
		valuesToSend['player1'] = null;
		valuesToSend['player2'] = null;
		valuesToSend['number'] = null;

		if(this.state.selectedPlayers.length>0)
			valuesToSend['player1'] = this.state.selectedPlayers[0];
		if(this.state.selectedPlayers.length>1)
			valuesToSend['player2'] = this.state.selectedPlayers[1];
		if(this.state.selectedNumber!==-1)
			valuesToSend['number'] = this.state.selectedNumber;

		this.props.roundCallback(valuesToSend);
	}

	setDefaultSelection(choiceType) {
		var selectionSatisfied = false;

		if(choiceType === "single") {
			if(this.state.num_players - this.state.num_disabled_players <= 1 //only current player is eligible
				 	&& this.props.cardPlayed!=="Prince" && this.props.cardPlayed!=="Sycophant")
				selectionSatisfied = true;

			// if(this.props.syco.length>=1)
			// 	selectionSatisfied = true;
		} 
		else if(choiceType === "double") {
			if(this.state.num_players - this.state.num_disabled_players <= 1) //only current player is eligible but 2 to choose
				selectionSatisfied = true;
			else if(this.state.num_players - this.state.num_disabled_players <= 2 //only 2 players are eligible including current
					&& this.props.cardPlayed!=="Cardinal")
				selectionSatisfied = true;

			// if(this.props.syco.length>=2)
			// 	selectionSatisfied = true;
		}
		else { // type is 'either'
			if(this.state.num_players - this.state.num_disabled_players <= 1) //only current player is eligible
				selectionSatisfied = true;

			// if(this.props.syco.length>=1)
			// 	selectionSatisfied = true;
		}

		return selectionSatisfied;
	}

	getList(choiceType) {
		var list = null;
		if(["Assassin", "Constable", "Count", "Countess", "Handmaid", "Princess"].indexOf(this.props.cardPlayed)>=0) { //no action
			list = null;
		}
		
		else {
			var enableCurrent = (this.props.cardPlayed==="Prince" || this.props.cardPlayed==="Sycophant"
									|| this.props.cardPlayed==="Cardinal");
			var isImmune = false;
  			var isSyco = false;
  			var isEliminated = false;

	  		list = (<ListGroup>
  				{Object.entries(this.props.all_players).map(([id, value]) => {
  					isImmune = (this.props.immune.indexOf(id)>=0);
  					isSyco = (this.props.syco.indexOf(id)>=0);
  					isEliminated = (this.props.eliminated.indexOf(id)>=0);
					return <ListGroup.Item className='List-item-design'
								variant={(this.state.selectedPlayers.indexOf(id)>=0)?'dark':'light'}
								key={id}
								disabled={(enableCurrent?false:(id===this.props.currentPlayer)) || 
											isImmune || isEliminated}
								onClick={(e) => this.selectPlayer(choiceType, id, e)}>{value}

								{isImmune?
									<FontAwesomeIcon style={{float: 'right'}} icon={faShieldAlt}/>: 
									(isSyco?
										<FontAwesomeIcon style={{float: 'right'}} icon={faHandshake}/>: 
										(isEliminated?
											<FontAwesomeIcon style={{float: 'right'}} icon={faSkull}/>: 
											<div></div>))}
							</ListGroup.Item>})}
				</ListGroup>);  
	  	} 

		return list;
	}

	render() {

		var choiceType = "";
		if(this.props.cardPlayed==="Baroness") //one or two choices
			choiceType = "either";
		else if(this.props.cardPlayed==="Cardinal") // two choices
			choiceType = "double";
		else // single choice
			choiceType = "single";

		const list = this.getList(choiceType);
		const defaultSelectionSatisfied = this.setDefaultSelection(choiceType);
		const card_numbers = [0,1,2,3,4,5,6,7,8,9];
		const num_list = (<ListGroup>
			  				{card_numbers.map((item, i) => {
								return <ListGroup.Item className='List-item-design'
											variant={this.state.selectedNumber===item?'dark':'light'}
											key={item} 
											disabled={item===1}
											onClick={(e) => this.selectNumber(item, defaultSelectionSatisfied, e)}>{item}
										</ListGroup.Item>})}
							</ListGroup>);

		var sendPlay = {};
		sendPlay['type'] = 'playComponent';
		sendPlay['playMode'] = 1;
		sendPlay['showPlay'] = {
			"currentPlayer": this.props.currentPlayer,
			"cardPlayed": this.props.cardPlayed,
			"selectedPlayers": this.state.selectedPlayers,
			"selectedNumber": this.state.selectedNumber,
			"immune": this.props.immune,
			"syco": this.props.syco,
			"eliminated": this.props.eliminated
		};
		this.props.socket.send(JSON.stringify(sendPlay));

		
		if(list!=null) {
			return (
				<div style={{margin: 'auto'}}>
					<Row style={{justifyContent: 'center'}}>
						<Col>{list}</Col>
						{(this.props.cardPlayed==="Guard"|| this.props.cardPlayed==="Bishop")?
							<Col>{num_list}</Col>: <div></div>}
					</Row>
					<Row style={{width: '50vw', paddingTop: '10px', margin: 'auto'}}> 
						<Button size="lg" block className='Confirm-button' 
						disabled={!(this.state.selectionSatisfied || defaultSelectionSatisfied)}
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
