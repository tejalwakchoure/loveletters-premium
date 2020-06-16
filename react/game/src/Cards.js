import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';

class Cards extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	selected: 1
		};
	    this.clickCard = this.clickCard.bind(this);
	}

	getCard() {
		if(this.props.cardname===null || this.props.cardname===undefined)
			return require('../assets/cards/loading_card.jpeg');
		else
			return require('../assets/cards/'+this.props.cardname+'.jpeg');
	}

	clickCard = () => {
		this.setState({
			opacity: 0.9
		});
	}

	render() {
		return(
	  		<Card onClick={this.clickCard} className='Card-design'>
			    <Card.Body style={{ padding: 0 }}>
			    	<Button className='card-button' variant="info">
			        	<Card.Img src={this.getCard()}/>
			        </Button>
			    </Card.Body>
	    	</Card>
		    
		);
	}
}

export default Cards;

