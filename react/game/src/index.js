import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import * as serviceWorker from './serviceWorker';

function getCards() {
	let headID = document.getElementsByTagName('head')[0];
      let collection = ['Bishop','Dowager Queen','Constable','Count','Sycophant','Baroness','Cardinal','Jester',
                          'Guard','Assassin','Princess','Countess','King','Prince','Handmaid','Baron','Priest'];
      	let link = {};
      	collection.map(function(item){
             link = document.createElement('link');
             link.rel = 'preload';
             link.as = "image";
             link.href = "../assets/cards/mini"+item+".png";
             console.log(link);
             headID.appendChild(link);
            });
      collection.map((item,index) => {
             link = document.createElement('link');
             link.rel = 'preload';
             link.as = "image";
             link.href = "../assets/cards/"+item+".jpeg";
             console.log(link);
             headID.appendChild(link);
            });
        link = document.createElement('link');
        link.rel = 'preload';
        link.as = "image";
        link.href = "../assets/cards/loading_card.jpeg";
        console.log(link);
        headID.appendChild(link);

        link = document.createElement('link');
        link.rel = 'preload';
        link.as = "image";
        link.href = "../assets/cards/display_blank.png";
        console.log(link);
        headID.appendChild(link);

        return <div></div>;
}
ReactDOM.render(

	<React.StrictMode>
	{getCards}
		<Game />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
