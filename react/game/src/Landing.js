import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Container, Row, Col} from 'react-bootstrap';
import socket from './socket-context';


class Landing extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	gameOn: true,
	    	all_players: [],
	    	showStartButton: false, // true for local testing, false for global
	    	userID: ' ',
	    	username: ' ',
	    	gameStatus: 0
	    };
	   	this.startGame = this.startGame.bind(this);
	   	this.startNewGame = this.startNewGame.bind(this);
	   	this.endGame = this.endGame.bind(this);
	}
	
	componentDidMount() {
	   	socket.onopen = () => {
			console.log('WebSocket Client Connected');
			socket.send(JSON.stringify({'type':'players'}));
		};


	   	socket.onmessage = (event) => {
	   		var obj = JSON.parse(event.data);
			console.log(obj);
			
			if(obj.type === 'playersS'){
				this.setState({
					all_players: obj.plyrs,
					userID: obj.uid,
					username: obj.username //???????
				});
				if(obj.uid === obj.host)
					this.setState({showStartButton: true});
			}
			else if(obj.type === 'startGame')
				this.props.gameCallback(this.state);
	   	}

	   	
	 //   	socket.on('disconnect', () => {
		//     console.log(this.state.username + ' disconnected');
		//     const index = this.state.all_players.indexOf(this.state.username);
		//     this.setState({all_players: all_players.splice(index, 1)});
		// });
	}

	startGame = () => {
		this.setState(
			{gameStatus: 1},
			socket.send(JSON.stringify({'type':'startGame'})));
		console.log("sent Start")
	}

	startNewGame = () => {
		this.setState(
			{gameStatus: 0},
			this.props.gameCallback(this.state));
		console.log("sent Start New game"); //nothing more to do here
	}

	endGame = () => {
		// socket.send(JSON.stringify({'type':'leaveGame'})); 
		// + call a disconnect of socket manually?
		//remove this player from the game metadata; it could still go on
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
				  		<Button size="lg" block className='Confirm-button' disabled={!this.state.showStartButton} onClick={this.startGame}>Start Game</Button>
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
