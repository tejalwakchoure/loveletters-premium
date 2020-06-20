import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLongArrowAltRight} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.css';
import './Game.css';


class CardCarousel extends React.Component {

	componentDidUpdate () {
		this.scrollToBottom();
	}

	getCard(name) {
		return require('../assets/cards/mini'+name+'.png');
	}

	scrollToBottom = () => {
		this.lastCard.scrollIntoView({ behavior: "smooth" });
	}

	render() {
		let playedCardlist = [];
		if(this.props.allCardsDiscarded!==undefined)
			playedCardlist = this.props.allCardsDiscarded;
		return(
			<div style={{margin: '0px 0px auto 0px', width: '100vw', display: 'flex', flexDirection: 'row'}}>
				<div style={{margin: '0px 0px auto 0px'}}>
					<div id="top-row" style={{display: 'flex', flexDirection: 'row'}}>
						<Card className="Card-carousel-num">
			                <Card.Body style={{ padding: 0, textAlign: 'center', backgroundColor: 'gray'}}>
			                  <Card.Text>{this.props.num_cards_left}</Card.Text>
			                </Card.Body>
		              	</Card>
		              	<div className='Card-carousel' style={{overflowX: 'scroll'}}> 
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
				  	</div>
			  	</div>
			  	<div style={{width: '100%'}}>
		            <ListGroup style={{minWidth: 'max-content', float: 'right'}}>
		                {this.props.order.map((id, index) => {
			                return <ListGroup.Item style={{padding: '3px 10px',
			                                              	fontSize: 'small',
			                                              	textAlign: 'center !important',
				                                            backgroundColor: 'gray',
				                                            color: 'white',
				                                            border: 0,
				                                            borderTop: '0.5px solid black',
				                                            minWidth: 'max-content'}}
			                                        key={id}>
			                          {this.props.currentPlayer===id?
			                          	<FontAwesomeIcon icon={faLongArrowAltRight}/>:<div></div>}
			                          <span>&nbsp;&nbsp;</span>
			                          {this.props.all_players[id]}
			                        </ListGroup.Item>})}
		            </ListGroup>
	            </div>
		    </div>
		);
	}
}

export default CardCarousel;

