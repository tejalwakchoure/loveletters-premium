import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import FA from 'react-fontawesome';
import './Game.css';
import {Container, Row, Col} from 'react-bootstrap';


class Results extends React.Component {

	constructor(props) {
	    super(props);
	    this.sendResults = this.sendResults.bind(this);
	}

	sendResults(final_winner) {
		console.log('Sent winner='+final_winner);
		this.props.gameCallback(final_winner);
	}

	render() {
		const points_display = this.props.points; //games won
		let final_winner = "p1";
		Object.entries(points_display).map(([key,value]) => {
			if (value>=4) {
				final_winner = key;
			}
			let stars = "";
			for(let i=0;i<value;i++)
				stars+="*";
			points_display[key] = stars; // Fontawesome hearts/envelopes
		})
		return(
			<Container className="Game-header">
			  	<Row style={{margin: 'auto'}}>
			  		<h4 className='Play-status'>{this.props.winner}'s letter reached the Princess!</h4>
			  	</Row>
			  	<Row style={{margin: 'auto'}}> 
			  		<ListGroup>
			  			{Object.entries(points_display).map(([key,value]) => {
							return <ListGroup.Item key={key} className='List-item-design'>
										<Col style={{display: 'inline'}}>{key}</Col>
										<Col style={{display: 'inline'}}>{value}</Col>
									</ListGroup.Item>})}
					</ListGroup>
			  	</Row>
			  	<Row style={{width: '50vw'}}> 
			  		{final_winner!==" "? <Button size="lg" block className='Confirm-button' onClick={(e) => this.sendResults(final_winner, e)}>OK</Button>
			  			:<Button size="lg" block className='Confirm-button' onClick={(e) => this.sendResults(final_winner, e)}>Start Next Round</Button>}
			  	</Row>
			</Container> 
		);
	}
}

export default Results;
