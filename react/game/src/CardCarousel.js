import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';

class CardCarousel extends React.Component {
	
	getCard(name) {
		return require('../assets/cards/mini'+name+'.png');
	}

	scrollToBottom = () => {
		this.lastCard.scrollIntoView({ behavior: "smooth" });
	}

	componentDidUpdate () {
		this.scrollToBottom();
	}

	render() {
		let playedCardlist = [];
		if(this.props.allCardsDiscarded!==undefined)
			playedCardlist = this.props.allCardsDiscarded;
		return(
		  	<div className='Card-carousel'> 
			  	{playedCardlist.map((item, index) => 
			  		<div key={item}>
                    	<Card style={{ width: '3.7vw', marginLeft: '1px' }}>
					      <Card.Body style={{ padding: 0 }}>
					        <Card.Img src={this.getCard(item)}/>
					      </Card.Body>
					    </Card>
					</div>
				)}
				<div id="last-card" ref={(e) => {this.lastCard=e;}}></div>
		  	</div>
		);
	}
}

export default CardCarousel;

