import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Multiselect from 'react-bootstrap-multiselect';
import './Game.css';
import {Values} from '../assets/values.js';
import {Container, Row, Col} from 'react-bootstrap';


class PlayCard extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	selectedPlayer: " "
	    }
	    this.selectPlayer = this.selectPlayer.bind(this);
		this.endPlay = this.endPlay.bind(this);
		this.getList = this.getList.bind(this);
	}

	selectPlayer(id){ 
		this.setState({
			selectedPlayer: id //turn that item disabled also
		});
	}

	endPlay() {
		const valuesToSend = {};
		valuesToSend[this.state.selectedPlayer] = Values.current_cards[this.state.selectedPlayer];
		valuesToSend[this.props.currentPlayer] = this.props.cardRemaining;
		console.log(valuesToSend);
		//getResult(valuesToSend);
		const results = {} //0 : no change (ex.Priest)
		results[this.state.selectedPlayer] = 1;//won
		results[this.props.currentPlayer] = -1;//lost and eliminated
		//display the result
		this.props.roundCallback(results);
	}

	getList() {
		//clean up list diaplay alignment also
		//Eliminated?? ICON!
		//Make sure you cant select yourself unless allowed
		var list = null;
		if(this.props.cardPlayed in ["Assassin", "Constable", "Count", "Countess", "Handmaid", "Princess"]) {
			list = {}; //no selection reqd
		}
		else if(this.props.cardPlayed=="Baroness") {
			list = (<ListGroup>
	  			{Values.all_players.map((item, i) => {
						return <ListGroup.Item action className='List-item-design' key={item} onClick={(e) => this.selectPlayer(item, e)}>{item}</ListGroup.Item>})}
			</ListGroup>); //1 or 2 selection
		}
		else if(this.props.cardPlayed=="Cardinal") {
			list = (<ListGroup>
	  			{Values.all_players.map((item, i) => {
						return <ListGroup.Item action className='List-item-design' key={item} onClick={(e) => this.selectPlayer(item, e)}>{item}</ListGroup.Item>})}
			</ListGroup>); //2 selection
		}
		else {
			list = (<ListGroup>
	  			{Values.all_players.map((item, i) => {
						return <ListGroup.Item action className='List-item-design' key={item} onClick={(e) => this.selectPlayer(item, e)}>{item}</ListGroup.Item>})}
			</ListGroup>); //1 selection
	  	}
		return list;
	}

	render() {
		return(
			<div>
				<Row style={{margin: 'auto'}}>
					{this.getList()}
				</Row>
				<Row style={{width: '50vw'}}> 
					<Button size="lg" block className='Confirm-button' onClick={this.endPlay}>OK</Button>
				</Row>
			</div>
		);
	}
}

export default PlayCard;



/*<ListGroup>
		{Values.all_players.map((item, i) => {
			return <ListGroup.Item action className='List-item-design' key={item} onClick={(e) => this.selectPlayer(item, e)}>{item}</ListGroup.Item>})}
</ListGroup>*/