import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';

class CardCarousel extends React.Component {
	getCard(name) {
		return require('../assets/cards/'+name+'.png');
	}	
	render() {
		let playedCardlist = [];
		if(this.props.allCardsDiscarded!==undefined)
			playedCardlist = this.props.allCardsDiscarded;
		
		return(
		  	<div className='Card-carousel'> 
			  	{playedCardlist.map((item) => 
			  		<div key={item}>
			  			<Card style={{ width: '6rem', marginLeft: '2px' }}>
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

