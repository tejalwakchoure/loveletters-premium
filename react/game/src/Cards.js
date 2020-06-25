import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';

class Cards extends React.Component {
	
	constructor(props) {
	    super(props);
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
			    	<Button className='card-button' variant="info" disabled={this.props.toDisable}>
			        	<Card.Img src={this.getCard()}/>
			        	{this.props.toDisable?(<Card.ImgOverlay style={{backgroundColor: 'rgba(184, 184, 184, 0.75)', color: 'white'}}>
    												<Card.Text style={{fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'}}>
    													You must discard the Countess
    												</Card.Text>
											  	</Card.ImgOverlay>):<div></div>}
			        </Button>
			    </Card.Body>
	    	</Card>
		    
		);
	}
}

export default Cards;

