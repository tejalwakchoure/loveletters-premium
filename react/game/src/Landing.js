import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Container, Row} from 'react-bootstrap';
import './Game.css';


class Landing extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	all_players: {},
	    	showStartButton: false, // true for local testing, false for global
	    	userID: ' ',
	    	gameStatus: 0,
	    	addExt: false,
	    	token_limit: 4
	    };
	   	this.getPlayers = this.getPlayers.bind(this);
	   	this.getStartGame = this.getStartGame.bind(this);
	   	this.startGame = this.startGame.bind(this);
	   	this.leaveGame = this.leaveGame.bind(this);
	}

	getOptions(obj) {
		this.setState({
			addExt: obj.addExt,
	    	token_limit: Number(obj.token_limit)
		},
		console.log("in getoptions:", obj.addExt, Number(obj.token_limit)));
	}

	getPlayers(obj) {
		this.setState({
			all_players: obj.plyrs,
			userID: obj.uid
		});
		if(obj.uid === obj.host)
			this.setState({showStartButton: true});
	}

	getStartGame(obj) {
		this.setState({gameStatus: 1}); 
		this.props.gameCallback(this.state);
	}

	startGame = () => {
		this.props.socket.send(JSON.stringify({
			'type':'startGame',
			'addExt': this.state.addExt,
			'token_limit': this.state.token_limit
		}));
	}

	leaveGame = () => {
		this.props.socket.send(JSON.stringify({'type':'leaveGame'}));
		window.location.replace('/');
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
				  	<Row style={{margin: 'auto'}}>
					  	<Form style={{textAlign: 'center', margin: 'auto'}}>
				          <Form.Label className='Play-status'><h5>-Game Options-</h5></Form.Label>
				            <Form.Group style={{textAlign: 'center'}}>
				              <Form.Check id="checkbox">
				                <Form.Check.Input type={"checkbox"} 
				                					disabled={!this.state.showStartButton}
				                					checked={this.state.addExt}
				                					onChange={(e) => {this.setState({addExt: e.target.checked});
				                										this.props.socket.send(JSON.stringify({
																						'type':'gameOptions',
																						'addExt': e.target.checked,
																						'token_limit': this.state.token_limit}));}}/>
				                <Form.Check.Label className='Play-status' style={{color: '#f1e4d7'}}>Add Extension Pack</Form.Check.Label>
				              </Form.Check>
				              </Form.Group>
				              <Form.Group style={{textAlign: 'center'}}>
				                <Form.Label className='Play-status'>Number of Tokens to Win</Form.Label>
				                <OverlayTrigger placement="right"
				                                delay={{ show: 250, hide: 250 }}
				                                defaultShow={true}
				                                overlay={<Tooltip>{this.state.token_limit}</Tooltip>}>
				                  <Form.Control type="range" 
				                                defaultValue={4} 
				                                min={2}
				                                max={10}
				                                step={1}
				                                value={this.state.token_limit}
				                                disabled={!this.state.showStartButton}
				                                onChange={(e) => {this.setState({token_limit: e.target.value});
				                									this.props.socket.send(JSON.stringify({
																		'type':'gameOptions',
																		'addExt': this.state.addExt,
																		'token_limit': Number(e.target.value)}));}}/>
				                </OverlayTrigger>
				              </Form.Group>
				        </Form>
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
