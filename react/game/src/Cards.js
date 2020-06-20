import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';

class Cards extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	selected: 1,
	    	allImgs: this.props.allImgs
		};
	    this.clickCard = this.clickCard.bind(this);
	}

	// componentDidMount() {
	// 	const card_names = ['Bishop','Dowager Queen','Constable','Count','Sycophant','Baroness','Cardinal','Jester', 
 //                        	'Guard','Assassin','Princess','Countess','King','Prince','Handmaid','Baron','Priest'];
    
	//     let imagesToBePreloaded = {};
	//     imagesToBePreloaded['loading_card'] = require('../assets/cards/loading_card.jpeg');
	//     card_names.map((img, index) => {
	//         imagesToBePreloaded[img] = require('../assets/cards/'+img+'.jpeg');});
	//     this.setState({allImgs: imagesToBePreloaded});
	// }

	getCard() {
		if(this.props.cardname===null || this.props.cardname===undefined)
			return this.state.allImgs['loading_card'];
		else
			return this.state.allImgs[this.props.cardname];
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

