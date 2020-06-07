import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import {Values} from '../assets/values.js';
import './Game.css';

class CardCarousel extends React.Component {
	getCard(name) {
		return require('../assets/cards/'+name+'.png');
	}	
	render() {
		return(
		  	<div className='Card-carousel'> 
		  	{Values.played_cards.map((item, i) => {
		  		return <div id={i}>
		  			<Card style={{ width: '6rem', marginLeft: '2px' }}>
				      <Card.Body style={{ padding: 0 }}>
				        <Card.Img src={this.getCard(item)}/>
				      </Card.Body>
				    </Card>
		  		</div>
			})}
		  	</div>
		);
	}
}

export default CardCarousel;

