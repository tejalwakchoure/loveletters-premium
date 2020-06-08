import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';

class Cards extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	opacity: 1
		};
	    this.clickCard = this.clickCard.bind(this);
	}

	getCard() {
		return require('../assets/cards/'+this.props.cardname+'.png');
	}

	clickCard = () => {
		this.setState({
			opacity: 0.9
		});
		console.log("inner click")
	}

	render() {
		return(
		  	<Card hoverable="true" onClick={this.clickCard} style={{opacity: this.state.opacity}} className='Card-design'>
		      <Card.Body style={{ padding: 0 }}>
		        <Card.Img src={this.getCard()}/>
		      </Card.Body>
		    </Card>
		);
	}
}

export default Cards;

