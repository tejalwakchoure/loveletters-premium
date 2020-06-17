import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';

class CardCarousel extends React.Component {
	getCard(name) {
		return require('../assets/cards/mini'+name+'.png');
	}	
	render() {
		let playedCardlist = [];
		if(this.props.allCardsDiscarded!==undefined)
			playedCardlist = this.props.allCardsDiscarded;
		
		return(
		  	<div className='Card-carousel'> 
			  	{playedCardlist.map((item, index) => 
			  		<div key={item}>
                    	<Card style={index===0?{ width: '3.2vw', marginLeft: '1px' }:{ width: '3.2vw', marginLeft: '0px' }}>
					      <Card.Body style={{ padding: 0 }}>
					        <Card.Img src={this.getCard(item)}/>
					      </Card.Body>
					    </Card>
					</div>
				)}
		  	</div>
		);
	}
}

export default CardCarousel;

