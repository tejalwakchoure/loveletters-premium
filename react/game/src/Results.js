import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Container, Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons';


class Results extends React.Component {

	constructor(props) {
	    super(props);
	    this.getResults = this.getResults.bind(this);
	}

	getResults() {
		const points_display = this.props.points; //tokens won
		let displayIcon = <FontAwesomeIcon style={{float: 'right'}} icon={faHeart}/>;

		Object.entries(points_display).map(([key,value]) => {
			let icons = [];
			for(let i=0;i<value;i++)
				icons.concat(displayIcon);
			points_display[key] = icons;
		});

		return points_display;
	}

	
	render() {
		const points_display = this.getResults();
		return(
			<Container className="Game-header">
			  	<Row style={{margin: 'auto'}}>
			  		<h3 className='Play-status'>{this.props.winner}'s letter reached the Princess!</h3>
			  	</Row>
			  	{this.props.gameWinner!==undefined?
			  		<Row style={{margin: 'auto'}}><h2 className='Play-status'>{this.props.winner} won the Princess' heart!</h2></Row>: <div></div>}
			  	<Row style={{margin: 'auto'}}> 
			  		<ListGroup>
			  			{Object.entries(points_display).map(([key,value]) => {
							return <ListGroup.Item key={key} className='List-item-design'>
										<Col style={{display: 'inline'}}>{key}</Col>
										<Col style={{display: 'inline'}}>{value.map((item,i) => {return(<span>item</span>)})}</Col>
									</ListGroup.Item>})}
					</ListGroup>
			  	</Row>
			  	{this.props.gameWinner!==undefined? 
			  		<Row style={{width: '50vw'}}>
			  			<Col><Button size="lg" block className='Confirm-button' onClick={(e) => this.props.gameCallback(true)}>Start New Game</Button></Col>
			  			<Col><Button size="lg" block className='Confirm-button' onClick={(e) => this.props.gameCallback(false)}>Leave Game</Button></Col>
			  		</Row> :
			  		<Row style={{width: '50vw'}}>
			  			<Button size="lg" block className='Confirm-button' onClick={(e) => this.props.gameCallback(true)}>Start Next Round</Button>}
			  		</Row>}
			</Container> 
		);
	}
}

export default Results;
