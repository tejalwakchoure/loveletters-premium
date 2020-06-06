import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';

class Cards extends React.Component {
	getCard() {
		return require('../assets/cards/'+this.props.cardname+'.png');
	}	
	render() {
		return(
		  	<Card className='Card-design'>
		      <Card.Body style={{ padding: 0 }}>
		        <Card.Img src={this.getCard()}/>
		      </Card.Body>
		    </Card> 
		);
	}
}

export default Cards;

