import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import './Game.css';
import {Values} from '../assets/values.js';
import {Container, Row, Col} from 'react-bootstrap';


class PlayCard extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
		};
	}

	render() {
		return(
			<h2 style={{color: 'white'}}>Playing {this.props.cardPlayed}</h2>
			);
	}
}

export default PlayCard;