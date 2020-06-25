import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup';
import './Game.css';
import {Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShieldAlt, faHandshake, faSkull, faCrown, faUserSecret, faChessBishop} from '@fortawesome/free-solid-svg-icons';

class ShowPlay extends React.Component {
	
	constructor(props) {
	    super(props);
		this.getList = this.getList.bind(this);
	}

	getList() {
		var list = null;
		if(["Assassin", "Constable", "Count", "Countess", "Handmaid", "Princess"].indexOf(this.props.playCardData.cardPlayed)>=0) {
			list = null;
		}
		
		else {
			var enableCurrent = (this.props.playCardData.cardPlayed==="Prince" || this.props.playCardData.cardPlayed==="Sycophant"
									|| this.props.playCardData.cardPlayed==="Cardinal");

	  		list = (<ListGroup>
  				{Object.entries(this.props.all_players).map(([id, value]) => {
					return <ListGroup.Item className='List-item-design'
								variant={(this.props.playCardData.selectedPlayers.indexOf(id)>=0)?'dark':'light'}
								key={id}
								disabled={(enableCurrent?false:(id===this.props.playCardData.currentPlayer)) || 
											(this.props.playCardData.allPlayerInfo[id][1]===true) || 
												(this.props.playCardData.allPlayerInfo[id][0]===true)}>
								
								{(this.props.playCardData.allPlayerInfo[id][3]===true)?
									<FontAwesomeIcon style={{float: 'left'}} icon={faCrown}/>: <div></div>}
								{(this.props.playCardData.allPlayerInfo[id][4]===true)?
									<FontAwesomeIcon style={{float: 'left'}} icon={faUserSecret}/>: <div></div>}
								{(this.props.playCardData.allPlayerInfo[id][5]>0)?
									(<div>
										{(this.props.playCardData.allPlayerInfo[id][5]>1)? <FontAwesomeIcon style={{float: 'left'}} icon={faChessBishop}/>: <div></div>}
										<FontAwesomeIcon style={{float: 'left'}} icon={faChessBishop}/>
									</div>)
  									: <div></div>}
								{value}
								{(this.props.playCardData.allPlayerInfo[id][0]===true)?
									<FontAwesomeIcon style={{float: 'right'}} icon={faSkull}/>: 
									((this.props.playCardData.allPlayerInfo[id][1]===true)?
										<FontAwesomeIcon style={{float: 'right'}} icon={faShieldAlt}/>: 
										((this.props.playCardData.allPlayerInfo[id][2]===true)?
											<FontAwesomeIcon style={{float: 'right'}} icon={faHandshake}/>: 
											<div></div>))}
							</ListGroup.Item>})}
				</ListGroup>);
	  	} 

		return list;
	}

	render() {
		const list = this.getList();
		const card_numbers = [0,1,2,3,4,5,6,7,8,9];
		const num_list = (<ListGroup>
			  				{card_numbers.map((item, i) => {
								return <ListGroup.Item className='List-item-design'
											variant={this.props.playCardData.selectedNumber===item?'dark':'light'}
											key={item} 
											disabled={(this.props.playCardData.cardPlayed==="Guard")?(item===1):(item===-1)}>{item}
										</ListGroup.Item>})}
							</ListGroup>);

							
		if(list!=null) {
			return (
				<div style={{margin: 'auto'}}>
					<Row style={{justifyContent: 'center'}}>
						<Col>{list}</Col>
						{(this.props.playCardData.cardPlayed==="Guard"|| this.props.playCardData.cardPlayed==="Bishop")?
							<Col>{num_list}</Col>: <div></div>}
					</Row>
				</div>
			);
		}
		else {
			return (<div></div>);
		}
	}
}

export default ShowPlay;
