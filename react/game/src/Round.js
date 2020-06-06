import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import './Game.css';
import Cards from './Card.js';
import CardCarousel from './CardCarousel.js';
import {Values} from '../assets/values.js';
import {Container, Row, Col} from 'react-bootstrap';


class Round extends React.Component {
	render() {
		return(
			<Container className="Game-header">
			  	<Row>
			  		<CardCarousel/>
			  	</Row>
			  	<Row style={{margin: 'auto'}}>
			  		<Cards cardname="Jester"/>
			  	</Row> 
			  	<Row style={{width: '50vw'}}> 
			  		<Button size="lg" block className='Discard-button'>Discard</Button>
			  	</Row>
			</Container>
		);
	}
}

export default Round;

{/*<ul>
	{Values.cards.map((item, i) => {
  		return <li key={i}>
  			<Cards cardname={item}/>
  		</li>
	})}
</ul>*/}