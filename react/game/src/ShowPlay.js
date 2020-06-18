import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShieldAlt, faHandshake, faSkull} from '@fortawesome/free-solid-svg-icons';

class ShowPlay extends React.Component {
	
	constructor(props) {
	    super(props);
	    // this.state = {
	    // 	selectedPlayers: this.props.syco,
	    // 	selectionSatisfied: false,
	    // 	selectedNumber: -1,
	    // 	num_disabled_players: this.props.immune.length + this.props.eliminated.length,
	    // 	num_players: Object.keys(this.props.all_players).length
	    // }
	    // this.selectPlayer = this.selectPlayer.bind(this);
	    // this.selectNumber = this.selectNumber.bind(this);
		this.getList = this.getList.bind(this);
		// this.setDefaultSelection = this.setDefaultSelection.bind(this);

	}

	// selectPlayer(type, item){ 
	// 	let selectedPlayers = this.state.selectedPlayers;
	// 	let x = 0;
		
	// 	if(type==='single') {
	// 		if(this.props.syco.length===0) //no sycophants; proceed as normal
	// 			selectedPlayers = [item];
			
	// 		if(this.props.cardPlayed!=="Guard" && this.props.cardPlayed!=="Bishop")
	// 			this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
	// 		else
	// 			this.setState({selectionSatisfied: this.state.selectedNumber!==-1, selectedPlayers: selectedPlayers});
	// 	}
	// 	else {
	// 		if(this.props.syco.length===0 || !(this.props.syco.indexOf(item)>=0)) { //this item is not a sycophant
	// 			x = selectedPlayers.indexOf(item);
	// 			if(x!==undefined && x>=0) {
	// 				selectedPlayers.splice(x, 1);
	// 			} else {
	// 				selectedPlayers = selectedPlayers.concat(item);
	// 			}
	// 		}

	// 		if(type==='double') {
	// 			if(selectedPlayers.length===2) {
	// 					this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
	// 			} else {
	// 				this.setState({selectionSatisfied: false, selectedPlayers: selectedPlayers});
	// 			}
				
	// 		} else { // type is 'either'
	// 			if(selectedPlayers.length===1 || selectedPlayers.length===2) {
	// 				this.setState({selectionSatisfied: true, selectedPlayers: selectedPlayers});
	// 			} else {
	// 				this.setState({selectionSatisfied: false, selectedPlayers: selectedPlayers});
	// 			}
	// 		}	
	// 	}
	// 	console.log('selected player ids:'+selectedPlayers)
	// }

	// selectNumber(item, defaultSelectionSatisfied) {
	// 	this.setState({selectionSatisfied: this.state.selectedPlayers.length>0, 
	// 						selectedNumber: defaultSelectionSatisfied?-1:item});
	// 	console.log('selected number:'+item);
	// }

	// setDefaultSelection(choiceType) {
	// 	var selectionSatisfied = false;

	// 	if(choiceType === "single") {
	// 		if(this.state.num_players - this.state.num_disabled_players <= 1 //only current player is eligible
	// 			 	&& this.props.cardPlayed!=="Prince" && this.props.cardPlayed!=="Sycophant")
	// 			selectionSatisfied = true;

	// 		if(this.props.syco.length>=1)
	// 			selectionSatisfied = true;
	// 	} 
	// 	else if(choiceType === "double") {
	// 		if(this.state.num_players - this.state.num_disabled_players <= 1) //only current player is eligible but 2 to choose
	// 			selectionSatisfied = true;
	// 		else if(this.state.num_players - this.state.num_disabled_players <= 2 //only 2 players are eligible including current
	// 				&& this.props.cardPlayed!=="Cardinal")
	// 			selectionSatisfied = true;

	// 		if(this.props.syco.length>=2)
	// 			selectionSatisfied = true;
	// 	}
	// 	else { // type is 'either'
	// 		if(this.state.num_players - this.state.num_disabled_players <= 1) //only current player is eligible
	// 			selectionSatisfied = true;

	// 		if(this.props.syco.length>=1)
	// 			selectionSatisfied = true;
	// 	}

	// 	return selectionSatisfied;
	// }

	getList() {
		var list = null;
		if(["Assassin", "Constable", "Count", "Countess", "Handmaid", "Princess"].indexOf(this.props.playCardData.cardPlayed)>=0) { //no action
			list = null;
		}
		
		else {
			var enableCurrent = (this.props.playCardData.cardPlayed==="Prince" || this.props.playCardData.cardPlayed==="Sycophant"
									|| this.props.playCardData.cardPlayed==="Cardinal");
			var isImmune = false;
  			var isSyco = false;
  			var isEliminated = false;

	  		list = (<ListGroup>
  				{Object.entries(this.props.all_players).map(([id, value]) => {
  					isImmune = (this.props.playCardData.immune.indexOf(id)>=0);
  					isSyco = (this.props.playCardData.syco.indexOf(id)>=0);
  					isEliminated = (this.props.playCardData.eliminated.indexOf(id)>=0);
					return <ListGroup.Item className='List-item-design'
								variant={(this.props.playCardData.selectedPlayers.indexOf(id)>=0)?'dark':'light'}
								key={id}
								disabled={(enableCurrent?false:(id===this.props.playCardData.currentPlayer)) || 
											isImmune || isEliminated}>{value}
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
		const list = this.getList();
		const card_numbers = [1,2,3,4,5,6,7,8,9];
		const num_list = (<ListGroup>
			  				{card_numbers.map((item, i) => {
								return <ListGroup.Item className='List-item-design'
											variant={this.props.playCardData.selectedNumber===item?'dark':'light'}
											key={item} 
											disabled={item===1}>{item}
										</ListGroup.Item>})}
							</ListGroup>);



		if(list!=null) {
			console.log('RENDER: ShowPlay for @'+this.props.playCardData.currentPlayer)
			return (
				<div style={{margin: 'auto'}}>
					<Row style={{justifyContent: 'center'}}>
						<Col>{list}</Col>
						{(this.props.playCardData.cardPlayed==="Guard"|| this.props.playCardData.cardPlayed==="Bishop")?
							<Col>{num_list}</Col>: <div></div>}
					</Row>
				</div>
			);
		}
		else {
			console.log('RENDER: ShowPlay for a non-choice card for @'+this.props.playCardData.currentPlayer)
			return (<div></div>);
		}
	}
}

export default ShowPlay;
