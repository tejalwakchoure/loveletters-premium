import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
//import {Values} from '../assets/values.js';
import {Container, Row, Col} from 'react-bootstrap';

import socket from './socket-context'


class Landing extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	gameOn: true
	    };
	   	this.startGame = this.startGame.bind(this);
	   	this.startNewGame = this.startNewGame.bind(this);
	   	this.endGame = this.endGame.bind(this);
	   	this.all_players = []
	   	socket.onopen = () => {
			console.log('WebSocket Client Connected');
			socket.send('Hello Server!');
			socket.send('players')
		};


	   	socket.onmessage = (event) => {
	   		console.log(event)
	   		var obj = JSON.parse(event.data);
	   		this.all_players = obj.in
	   		console.log(obj.in)
	   	}
	}

	startGame = () => {
		this.props.gameCallback(1);
	}

	startNewGame = () => {
		this.props.gameCallback(0);
	}

	endGame = () => {
		this.setState({
			gameOn: false //remove this player from the game metadata; it could still go on
		});
	}


	render() {
		if(this.props.toStartGame) {
			return(
				<Container className="Game-header">
				  	<Row style={{margin: 'auto'}}>
				  		<h4 className='Play-status'>Waiting For Players...</h4>
				  	</Row>
				  	<Row style={{margin: 'auto'}}>
				  		<ListGroup>
				  			{this.all_players.map((item, i) => {
		  						return <ListGroup.Item className='List-item-design'>{item}</ListGroup.Item>})}
						</ListGroup>
				  	</Row>
				  	<Row style={{width: '50vw'}}> 
				  		<Button size="lg" block className='Confirm-button' onClick={this.startGame}>Start Game</Button>
				  	</Row>
				</Container>
			);
		} 
		else {
			return(
				<Container className="Game-header">
				<Row style={{margin: 'auto'}}>
				  	<h4 className='Play-status'>{this.props.final_winner} won the game!</h4>
			  	</Row>
			  	<Row style={{margin: 'auto'}}> 
			  		<Col><Button size="lg" style={{width: '30vw'}} block className='Confirm-button' onClick={this.endGame}>Leave Game</Button></Col>
			  		<Col><Button size="lg" style={{width: '30vw'}} block className='Confirm-button' onClick={this.startNewGame}>Start New Game</Button></Col>
			  	</Row>
				</Container>
			);
		}
	}
}

export default Landing;
