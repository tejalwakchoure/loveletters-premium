import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Values} from '../assets/values.js';
import {Container, Row, Col} from 'react-bootstrap';


class Landing extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	gameOn: true
	    };
	   	this.startGame = this.startGame.bind(this);
	   	this.endGame = this.endGame.bind(this);
	}

	startGame = () => {
		this.props.gameCallback(1);
	}

	endGame = () => {
		this.setState({
			gameOn: false
		});
	}

	render() {
		if(this.props.toStartGame) {
			return(
				<Container className="Game-header">
				  	<Row>
				  		<h4 className='Play-status'> Waiting for players... </h4>
				  	</Row>
				  	<Row>
				  		<ListGroup>
				  			{Values.all_players.map((item, i) => {
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
				<Row>
				  	<h4 className='Play-status'>Game Over</h4>
			  	</Row>
			  	{this.state.gameOn?
			  	<Row> 
			  		<Button size="lg" style={{width: '30vw'}} block className='Confirm-button' onClick={this.endGame}>Leave Game</Button>
			  		<Button size="lg" style={{width: '30vw'}} block className='Confirm-button' onClick={this.startGame}>Start New Game</Button>
			  	</Row> : <h4 className='Play-status'>Thanks for playing!</h4>}
				</Container>
			);
		}
	}
}

export default Landing;
