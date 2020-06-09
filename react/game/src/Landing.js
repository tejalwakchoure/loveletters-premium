import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Container, Row, Col} from 'react-bootstrap';

import socket from './socket-context'


class Landing extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	gameOn: true,
	    	all_players: ["p1", "p2", "p3"]
	    };
	   	this.startGame = this.startGame.bind(this);
	   	this.startNewGame = this.startNewGame.bind(this);
	   	this.endGame = this.endGame.bind(this);
	}
	
	componentWillMount() {
	   	socket.onopen = () => {
			console.log('WebSocket Client Connected');
			socket.send(JSON.stringify({'type':'players'}))
		};


	   	socket.onmessage = (event) => {
	   		var obj = JSON.parse(event.data);
			console.log(obj)
			if(obj.type == 'playersS'){
				this.setState({all_players: obj.plyrs});
				//obj.uid has the my user-id
				//obj.host has uid of host 
				//obj.username has my username
			}
	   		
	   	}
	}

	startGame = () => {
		this.props.gameCallback(1, this.state.all_players);
		//socket.send(JSON.stringify({'type':'startGame'}))startGame
		//ALso have to change the onmessage function to something else, done is round.js
	}

	startNewGame = () => {
		this.props.gameCallback(0, this.state.all_players);
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
			  				{this.state.all_players.map((item, i) => {
								return <ListGroup.Item className='List-item-design' key={item}>
											{item}
										</ListGroup.Item>})}
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
