import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import SizeMe from 'react-sizeme';
import './Game.css';

class CardCarousel extends React.Component {
	getCard(name) {
		return require('../assets/cards/mini'+name+'.png');
	}	
	render() {
		let playedCardlist = [];
		if(this.props.allCardsDiscarded!==undefined)
			playedCardlist = this.props.allCardsDiscarded;
		const { width, height } = this.props.size;
		const cardWidth = (width<window.innerWidth)?'3.7vw': '3.1vw';
		return(
		  	<div className='Card-carousel'> 
			  	{playedCardlist.map((item, index) => 
			  		<div key={item}>
                    	<Card style={{ width: cardWidth, marginLeft: '1px' }}>
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

export default SizeMe()(CardCarousel);

