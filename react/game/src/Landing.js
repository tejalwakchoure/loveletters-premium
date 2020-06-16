import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Container, Row} from 'react-bootstrap';


class Landing extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	all_players: {},
	    	showStartButton: false, // true for local testing, false for global
	    	userID: ' ',
	    	username: ' ',
	    	gameStatus: 0
	    };
	   	this.getPlayers = this.getPlayers.bind(this);
	   	this.getStartGame = this.getStartGame.bind(this);
	   	this.startGame = this.startGame.bind(this);
	   	this.leaveGame = this.leaveGame.bind(this);
	}

	getPlayers(obj) {
		this.setState({
			all_players: obj.plyrs,
			userID: obj.uid,
			username: obj.username
		});
		if(obj.uid === obj.host)
			this.setState({showStartButton: true});
	}

	getStartGame(obj) {
		this.setState({gameStatus: 1}); 
		this.props.gameCallback(this.state);
		//console.log("Bois, we're moving ahead");
		console.log('starting game for @'+this.props.username)
	}

	startGame = () => {
		this.props.socket.send(JSON.stringify({'type':'startGame'}));
		console.log("@"+this.props.username+" sent startGame")
	}

	leaveGame = () => {
		this.props.socket.send(JSON.stringify({'type':'leaveGame'}));
		console.log("@"+this.props.username+" sent leaveGame")
	}

	render() {
		if(!this.props.leavingGame) {
			return(
				<Container className="Game-header">
				  	<Row style={{margin: 'auto'}}>
				  		<h4 className='Play-status'>Waiting For Players...</h4>
				  	</Row>
				  	<hr/>
				  	<Row style={{margin: 'auto'}}>
				  		<ListGroup>
			  				{Object.entries(this.state.all_players).map(([id, value]) => {
								return <ListGroup.Item className='List-item-design' key={id}>
											{value}
										</ListGroup.Item>})}
						</ListGroup>
				  	</Row>
				  	<Row style={{width: '50vw'}}> 
				  		<Button size="lg" block className='Confirm-button' disabled={!this.state.showStartButton} onClick={this.startGame}>Start Game</Button>
				  	</Row>
				</Container>
			);
		} 
		else{
			return (<div>{this.leaveGame()}</div>);
		}
	}
}

export default Landing;
