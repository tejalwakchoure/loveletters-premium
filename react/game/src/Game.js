import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import './Game.css';
import Round from './Round.js';

class Game extends React.Component {
	render() {
	  	return (
		    <Round/>
	    );
	}
}

export default Game;
