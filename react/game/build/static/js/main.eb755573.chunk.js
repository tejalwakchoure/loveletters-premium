(this.webpackJsonpgame=this.webpackJsonpgame||[]).push([[0],{102:function(e,t,a){var s={"./Assassin.jpeg":189,"./Baron.jpeg":190,"./Baroness.jpeg":191,"./Bishop.jpeg":192,"./Cardinal.jpeg":193,"./Constable.jpeg":194,"./Count.jpeg":195,"./Countess.jpeg":196,"./Dowager Queen.jpeg":197,"./Guard.jpeg":198,"./Handmaid.jpeg":199,"./Jester.jpeg":200,"./King.jpeg":201,"./Priest.jpeg":202,"./Prince.jpeg":203,"./Princess.jpeg":204,"./Sycophant.jpeg":205,"./loading_card.jpeg":206};function n(e){var t=l(e);return a(t)}function l(e){if(!a.o(s,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return s[e]}n.keys=function(){return Object.keys(s)},n.resolve=l,e.exports=n,n.id=102},112:function(e,t,a){e.exports=a(215)},188:function(e,t,a){},189:function(e,t,a){e.exports=a.p+"static/media/Assassin.378bfb5f.jpeg"},190:function(e,t,a){e.exports=a.p+"static/media/Baron.746fcb29.jpeg"},191:function(e,t,a){e.exports=a.p+"static/media/Baroness.9412a60f.jpeg"},192:function(e,t,a){e.exports=a.p+"static/media/Bishop.dc3946bc.jpeg"},193:function(e,t,a){e.exports=a.p+"static/media/Cardinal.25c40e09.jpeg"},194:function(e,t,a){e.exports=a.p+"static/media/Constable.30fe3a5c.jpeg"},195:function(e,t,a){e.exports=a.p+"static/media/Count.33b17be7.jpeg"},196:function(e,t,a){e.exports=a.p+"static/media/Countess.b39b3239.jpeg"},197:function(e,t,a){e.exports=a.p+"static/media/Dowager Queen.f88d1e27.jpeg"},198:function(e,t,a){e.exports=a.p+"static/media/Guard.d9e4ee43.jpeg"},199:function(e,t,a){e.exports=a.p+"static/media/Handmaid.2184414b.jpeg"},200:function(e,t,a){e.exports=a.p+"static/media/Jester.c3c265f4.jpeg"},201:function(e,t,a){e.exports=a.p+"static/media/King.49f2efa9.jpeg"},202:function(e,t,a){e.exports=a.p+"static/media/Priest.79047ce6.jpeg"},203:function(e,t,a){e.exports=a.p+"static/media/Prince.84d1cfb6.jpeg"},204:function(e,t,a){e.exports=a.p+"static/media/Princess.dbe5ffb7.jpeg"},205:function(e,t,a){e.exports=a.p+"static/media/Sycophant.67d055f9.jpeg"},206:function(e,t,a){e.exports=a.p+"static/media/loading_card.e650822c.jpeg"},215:function(e,t,a){"use strict";a.r(t);var s=a(0),n=a.n(s),l=a(104),r=a.n(l),i=(a(188),a(12)),c=a(13),o=a(4),u=a(15),d=a(14),m=(a(30),a(37),a(16)),p=a(27),y=function(e){Object(u.a)(s,e);var t=Object(d.a)(s);function s(e){var a;return Object(i.a)(this,s),(a=t.call(this,e)).clickCard=function(){a.setState({opacity:.9})},a.state={selected:1},a.clickCard=a.clickCard.bind(Object(o.a)(a)),a}return Object(c.a)(s,[{key:"getCard",value:function(){return a(102)("./"+this.props.cardname+".jpeg")}},{key:"render",value:function(){return n.a.createElement(p.a,{onClick:this.clickCard,className:"Card-design"},n.a.createElement(p.a.Body,{style:{padding:0}},n.a.createElement(m.a,{className:"card-button",variant:"info"},n.a.createElement(p.a.Img,{src:this.getCard()}))))}}]),s}(n.a.Component),h=function(e){Object(u.a)(s,e);var t=Object(d.a)(s);function s(){return Object(i.a)(this,s),t.apply(this,arguments)}return Object(c.a)(s,[{key:"getCard",value:function(e){return a(102)("./"+e+".jpeg")}},{key:"render",value:function(){var e=this,t=[];return void 0!==this.props.allCardsDiscarded&&(t=this.props.allCardsDiscarded),n.a.createElement("div",{className:"Card-carousel"},t.map((function(t){return n.a.createElement("div",{key:t},n.a.createElement(p.a,{style:{width:"6rem",marginLeft:"2px"}},n.a.createElement(p.a.Body,{style:{padding:0}},n.a.createElement(p.a.Img,{src:e.getCard(t)}))))})))}}]),s}(n.a.Component),g=a(31),f=a(19),E=a(216),b=a(217),v=a(38),C=a(39),k=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var s;return Object(i.a)(this,a),(s=t.call(this,e)).state={selectedPlayers:s.props.syco,selectionSatisfied:!1,selectedNumber:-1,num_disabled_players:s.props.immune.length+s.props.eliminated.length,num_players:Object.keys(s.props.all_players).length},s.selectPlayer=s.selectPlayer.bind(Object(o.a)(s)),s.selectNumber=s.selectNumber.bind(Object(o.a)(s)),s.endPlay=s.endPlay.bind(Object(o.a)(s)),s.getList=s.getList.bind(Object(o.a)(s)),s}return Object(c.a)(a,[{key:"selectPlayer",value:function(e,t){var a=this.state.selectedPlayers,s=0;"single"===e?this.state.num_disabled_players===this.state.num_players-1&&"Prince"!==this.props.cardPlayed&&"Sycophant"!==this.props.cardPlayed?this.setState({selectionSatisfied:!0}):(0===this.props.syco.length&&(a=[t]),"Guard"!==this.props.cardPlayed&&"Bishop"!==this.props.cardPlayed?this.setState({selectionSatisfied:!0,selectedPlayers:a}):this.setState({selectedPlayers:a})):((0===this.props.syco.length||!this.props.syco.indexOf(t)>=0)&&(void 0!==(s=a.indexOf(t))&&s>=0?a.splice(s,1):a=a.concat(t)),"double"===e?this.state.num_disabled_players===this.state.num_players-1||this.state.num_disabled_players>=this.state.num_players-2&&"Cardinal"!==this.props.cardPlayed?this.setState({selectionSatisfied:!0}):2===a.length?this.setState({selectionSatisfied:!0,selectedPlayers:a}):this.setState({selectionSatisfied:!1,selectedPlayers:a}):this.state.num_disabled_players===this.state.num_players-1?this.setState({selectionSatisfied:!0}):1===a.length||2===a.length?this.setState({selectionSatisfied:!0,selectedPlayers:a}):this.setState({selectionSatisfied:!1,selectedPlayers:a})),console.log("selected player ids:"+a)}},{key:"selectNumber",value:function(e){this.setState({selectionSatisfied:!0,selectedNumber:e}),console.log("selected number:"+e)}},{key:"endPlay",value:function(){var e={type:"discard"};e.player=this.props.currentPlayer,e.card=this.props.cardPlayed,e.player1=null,e.player2=null,e.number=null,this.state.selectedPlayers.length>0&&(e.player1=this.state.selectedPlayers[0]),this.state.selectedPlayers.length>1&&(e.player2=this.state.selectedPlayers[1]),-1!==this.state.selectedNumber&&(e.number=this.state.selectedNumber),console.log("sending to round=",e),this.props.roundCallback(e)}},{key:"getList",value:function(){var e=this,t=null;if(["Assassin","Constable","Count","Countess","Handmaid","Princess"].indexOf(this.props.cardPlayed)>=0)t=null,console.log("list is null");else{var a="Prince"===this.props.cardPlayed||"Sycophant"===this.props.cardPlayed||"Cardinal"===this.props.cardPlayed,s="",l=!1,r=!1,i=!1;s="Baroness"===this.props.cardPlayed?"either":"Cardinal"===this.props.cardPlayed?"double":"single",t=n.a.createElement(f.a,null,Object.entries(this.props.all_players).map((function(t){var c=Object(g.a)(t,2),o=c[0],u=c[1];return l=e.props.immune.indexOf(o)>=0,r=e.props.syco.indexOf(o)>=0,i=e.props.eliminated.indexOf(o)>=0,n.a.createElement(f.a.Item,{className:"List-item-design",variant:e.state.selectedPlayers.indexOf(o)>=0?"dark":"light",key:o,disabled:!a&&o===e.props.currentPlayer||l||i,onClick:function(t){return e.selectPlayer(s,o,t)}},u,l?n.a.createElement(v.a,{style:{float:"right"},icon:C.c}):r?n.a.createElement(v.a,{style:{float:"right"},icon:C.a}):i?n.a.createElement(v.a,{style:{float:"right"},icon:C.d}):n.a.createElement("div",null))})))}return t}},{key:"render",value:function(){var e=this,t=this.getList();return null!=t?(console.log("RENDER: PlayCard for @"+this.props.currentPlayer),n.a.createElement("div",{style:{margin:"auto"}},n.a.createElement(E.a,{style:{justifyContent:"center"}},n.a.createElement(b.a,null,t),"Guard"===this.props.cardPlayed||"Bishop"===this.props.cardPlayed?n.a.createElement(b.a,null,n.a.createElement(f.a,null,[1,2,3,4,5,6,7,8,9].map((function(t,a){return n.a.createElement(f.a.Item,{className:"List-item-design",variant:e.state.selectedNumber===t?"dark":"light",key:t,disabled:1===t,onClick:function(a){return e.selectNumber(t,a)}},t)})))):n.a.createElement("div",null)),n.a.createElement(E.a,{style:{width:"50vw",paddingTop:"10px",margin:"auto"}},n.a.createElement(m.a,{size:"lg",block:!0,className:"Confirm-button",disabled:!this.state.selectionSatisfied,onClick:this.endPlay},"OK")))):(console.log("RENDER: PlayCard for a non-choice card for @"+this.props.currentPlayer),n.a.createElement("div",null,this.endPlay()))}}]),a}(n.a.Component),j=a(218),P=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var s;return Object(i.a)(this,a),(s=t.call(this,e)).discard=function(){s.setState({playMode:1,discard_pile:s.state.discard_pile.concat(s.state.cardToPlay)}),console.log(s.props.all_players[s.state.currentPlayer]+" is discarding "+s.state.cardToPlay)},s.endTurn=function(){null!==s.state.results.roundWinner?(console.log("We have a round winner"),s.props.gameCallback(s.state.results),console.log("Round winner sent to Game")):(console.log("No round winner yet"),s.props.socket.send(JSON.stringify({type:"nextTurn"})),console.log("sent nextTurn for @"+s.props.username))},s.endTurnByButton=function(){s.setState({turnEnded:!0}),s.endTurn()},s.playCardCallback=function(e){s.props.socket.send(JSON.stringify(e)),console.log("sent played values from Round for @"+s.props.username)},s.state={cardToPlay:" ",cardRemaining:" ",playMode:0,currentPlayer:" ",playStatus:" ",results:{},currentCards:[],immune:[],syco:[],eliminated:[],prevTurnMessage:" ",discard_pile:[],turnEnded:!1},s.getTurn=s.getTurn.bind(Object(o.a)(s)),s.getResults=s.getResults.bind(Object(o.a)(s)),s.selectCard=s.selectCard.bind(Object(o.a)(s)),s.discard=s.discard.bind(Object(o.a)(s)),s.endTurn=s.endTurn.bind(Object(o.a)(s)),s.endTurnByButton=s.endTurnByButton.bind(Object(o.a)(s)),s.playCardCallback=s.playCardCallback.bind(Object(o.a)(s)),s.props.socket.send(JSON.stringify({type:"nextRound"})),console.log("sent nextRound for @"+s.props.username),s}return Object(c.a)(a,[{key:"getTurn",value:function(e){this.setState({playMode:0,currentPlayer:e.player,currentCards:e.cards,immune:e.immune,syco:e.sycho,eliminated:e.eliminated,prevTurnMessage:e.prevTurn,playStatus:this.props.all_players[e.player]+" is playing"})}},{key:"getResults",value:function(e){null!==e.roundWinner&&e.discard_pile===[]&&this.setState({turnEnded:!0}),this.setState({playMode:2,results:e,discard_pile:e.discard_pile})}},{key:"selectCard",value:function(e,t){this.setState({cardToPlay:e,cardRemaining:t})}},{key:"render",value:function(){var e=this;console.log("user = "+this.props.userID),console.log("currentPlayer = "+this.state.currentPlayer),console.log(this.state.currentCards),this.state.turnEnded&&this.endTurn();var t=this.state.currentCards[0];if(void 0===t&&(t="loading_card"),this.props.userID===this.state.currentPlayer){console.log(this.props.username+"is playing");var a=this.state.currentCards[1];return void 0===a&&(a="loading_card"),0===this.state.playMode?(console.log("RENDER MODE: current player x choosing card"),n.a.createElement(j.a,{className:"Game-header"},n.a.createElement(E.a,null,n.a.createElement(h,{allCardsDiscarded:this.state.discard_pile})),n.a.createElement(E.a,{style:{margin:"auto"}},null!==this.state.prevTurnMessage?n.a.createElement("h5",{className:"Play-status"},this.state.prevTurnMessage):n.a.createElement("div",null)),n.a.createElement("hr",null),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h4",{className:"Play-status"},this.state.playStatus)),n.a.createElement("hr",null),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement(b.a,{style:{display:"inline-flex"},onClick:function(s){return e.selectCard(t,a,s)}},n.a.createElement(y,{cardname:t})),n.a.createElement(b.a,{style:{display:"inline-flex"},onClick:function(s){return e.selectCard(a,t,s)}},n.a.createElement(y,{cardname:a}))),n.a.createElement(E.a,{style:{width:"50vw"}},n.a.createElement(m.a,{size:"lg",block:!0,className:"Confirm-button",disabled:" "===this.state.cardToPlay,onClick:this.discard},"Discard")))):1===this.state.playMode?(console.log("RENDER MODE: current player x playing card"),n.a.createElement(j.a,{className:"Game-header"},n.a.createElement(E.a,null,n.a.createElement(h,{allCardsDiscarded:this.state.discard_pile})),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h4",{className:"Play-status"},this.state.playStatus)),n.a.createElement("hr",null),n.a.createElement(k,{currentPlayer:this.state.currentPlayer,cardPlayed:this.state.cardToPlay,cardRemaining:this.state.cardRemaining,roundCallback:this.playCardCallback,all_players:this.props.all_players,immune:this.state.immune,syco:this.state.syco,eliminated:this.state.eliminated}))):(console.log("RENDER MODE: current player x results"),n.a.createElement(j.a,{className:"Game-header"},n.a.createElement(E.a,null,n.a.createElement(h,{allCardsDiscarded:this.state.discard_pile})),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h4",{className:"Play-status"},this.state.results.statusMsg)),n.a.createElement("hr",null),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h3",{className:"Play-status"},this.state.results.resultMsg)),n.a.createElement("hr",null),n.a.createElement(E.a,null,null!==this.state.results.card1?n.a.createElement(b.a,{style:{display:"inline-flex"}},n.a.createElement(y,{cardname:this.state.results.card1})):n.a.createElement("div",null),null!==this.state.results.card2?n.a.createElement(b.a,{style:{display:"inline-flex"}},n.a.createElement(y,{cardname:this.state.results.card2})):n.a.createElement("div",null)),n.a.createElement(E.a,{style:{width:"50vw",paddingTop:"10px",margin:"auto"}},n.a.createElement(m.a,{size:"lg",block:!0,className:"Confirm-button",onClick:this.endTurnByButton},"OK"))))}return this.props.userID!==this.state.results.player1&&this.props.userID!==this.state.results.player2||2!==this.state.playMode?(console.log("RENDER MODE: other players/one of the players involved in the turn x playmode!=2"),n.a.createElement(j.a,{className:"Game-header"},n.a.createElement(E.a,null,n.a.createElement(h,{allCardsDiscarded:this.state.discard_pile})),2===this.state.playMode?n.a.createElement("div",{style:{margin:"auto"}},n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h4",{className:"Play-status"},this.state.results.statusMsg)),n.a.createElement("hr",null),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h3",{className:"Play-status"},this.state.results.resultMsg)),n.a.createElement("hr",null)):null!==this.state.prevTurnMessage?n.a.createElement("div",{style:{margin:"auto"}},n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h5",{className:"Play-status"},this.state.prevTurnMessage)),n.a.createElement("hr",null)):n.a.createElement("div",null),this.state.eliminated.indexOf(this.props.userID)>=0?n.a.createElement("div",{style:{margin:"auto"}},n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h3",{className:"Play-status"},"You have been eliminated")),n.a.createElement("hr",null)):n.a.createElement("div",{style:{margin:"auto"}},n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h3",{className:"Play-status"},"It's not your turn")),n.a.createElement("hr",null),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement(b.a,{style:{display:"inline-flex"}},n.a.createElement(y,{cardname:t})))))):(console.log("RENDER MODE: one of the players involved in the turn x results"),n.a.createElement(j.a,{className:"Game-header"},n.a.createElement(E.a,null,n.a.createElement(h,{allCardsDiscarded:this.state.discard_pile})),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h4",{className:"Play-status"},this.state.results.statusMsg)),n.a.createElement("hr",null),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h3",{className:"Play-status"},this.state.results.resultMsg)),n.a.createElement("hr",null),n.a.createElement(E.a,{style:{margin:"auto"}},null!==this.state.results.card1?n.a.createElement(b.a,{style:{display:"inline-flex"}},n.a.createElement(y,{cardname:this.state.results.card1})):n.a.createElement("div",null),null!==this.state.results.card2?n.a.createElement(b.a,{style:{display:"inline-flex"}},n.a.createElement(y,{cardname:this.state.results.card2})):n.a.createElement("div",null))))}}]),a}(n.a.Component),O=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var s;return Object(i.a)(this,a),(s=t.call(this,e)).startGame=function(){s.props.socket.send(JSON.stringify({type:"startGame"})),console.log("@"+s.props.username+" sent startGame")},s.leaveGame=function(){s.props.socket.send(JSON.stringify({type:"leaveGame"})),console.log("@"+s.props.username+" sent leaveGame")},s.state={gameOn:!0,all_players:{},showStartButton:!1,userID:" ",username:" ",gameStatus:0},s.getPlayers=s.getPlayers.bind(Object(o.a)(s)),s.getStartGame=s.getStartGame.bind(Object(o.a)(s)),s.startGame=s.startGame.bind(Object(o.a)(s)),s.leaveGame=s.leaveGame.bind(Object(o.a)(s)),s}return Object(c.a)(a,[{key:"getPlayers",value:function(e){this.setState({all_players:e.plyrs,userID:e.uid,username:e.username}),e.uid===e.host&&this.setState({showStartButton:!0})}},{key:"getStartGame",value:function(e){this.setState({gameStatus:1}),this.props.gameCallback(this.state),console.log("starting game for @"+this.props.username)}},{key:"render",value:function(){if(!this.props.leavingGame)return n.a.createElement(j.a,{className:"Game-header"},n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h4",{className:"Play-status"},"Waiting For Players...")),n.a.createElement("hr",null),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement(f.a,null,Object.entries(this.state.all_players).map((function(e){var t=Object(g.a)(e,2),a=t[0],s=t[1];return n.a.createElement(f.a.Item,{className:"List-item-design",key:a},s)})))),n.a.createElement(E.a,{style:{width:"50vw"}},n.a.createElement(m.a,{size:"lg",block:!0,className:"Confirm-button",disabled:!this.state.showStartButton,onClick:this.startGame},"Start Game")))}}]),a}(n.a.Component),S=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var s;return Object(i.a)(this,a),(s=t.call(this,e)).getResults=s.getResults.bind(Object(o.a)(s)),s}return Object(c.a)(a,[{key:"getResults",value:function(){var e=this.props.points,t=n.a.createElement(v.a,{icon:C.b}),a=n.a.createElement("span",null,"\xa0\xa0");return Object.entries(e).map((function(s){for(var n=Object(g.a)(s,2),l=n[0],r=n[1],i=[],c=0;c<r;c++)i=i.concat(t).concat(a);e[l]=i})),e}},{key:"render",value:function(){var e=this,t=this.getResults();return n.a.createElement(j.a,{className:"Game-header"},n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h3",{className:"Play-status"},this.props.allPlayers[this.props.winner],"'s letter reached the Princess!")),n.a.createElement("hr",null),null!==this.props.gameWinner?n.a.createElement("div",{style:{margin:"auto"}},n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement("h2",{className:"Play-status"},this.props.allPlayers[this.props.gameWinner]," won the Princess' heart!")),n.a.createElement("hr",null)):n.a.createElement("div",null),n.a.createElement(E.a,{style:{margin:"auto"}},n.a.createElement(f.a,null,Object.entries(t).map((function(t){var a=Object(g.a)(t,2),s=a[0],l=a[1];return n.a.createElement(f.a.Item,{key:s,className:"List-item-design Container"},n.a.createElement(E.a,null,n.a.createElement(b.a,{style:{display:"inline"}},e.props.allPlayers[s]),n.a.createElement(b.a,{style:{display:"inline"}},l.map((function(e,t){return n.a.createElement("span",{style:{float:"right"}},e)})))))})))),null!==this.props.gameWinner?n.a.createElement(E.a,{style:{width:"50vw"}},n.a.createElement(b.a,null,n.a.createElement(m.a,{size:"lg",block:!0,className:"Confirm-button",onClick:function(t){return e.props.gameCallback(!0)}},"Start New Game")),n.a.createElement(b.a,null,n.a.createElement(m.a,{size:"lg",block:!0,className:"Confirm-button",onClick:function(t){return e.props.gameCallback(!1)}},"Leave Game"))):n.a.createElement(E.a,{style:{width:"50vw"}},n.a.createElement(m.a,{size:"lg",block:!0,className:"Confirm-button",onClick:function(t){return e.props.gameCallback(!0)}},"Start Next Round")))}}]),a}(n.a.Component),N=new(a(109).w3cwebsocket)(("https:"===window.location.protocol?"wss://":"ws://")+window.location.host+"/ws"),_=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var s;return Object(i.a)(this,a),(s=t.call(this,e)).landingCallback=function(e){s.setState({gameStatus:e.gameStatus,all_players:e.all_players,userID:e.userID,username:e.username}),console.log("player info received from landing:",e),console.log("set gameStatus to 1")},s.roundCallback=function(e){s.setState({rounds_played:s.state.rounds_played+1,tokens:e.tokens,gameStatus:2,roundWinner:e.roundWinner,gameWinner:e.gameWinner}),console.log("results received from Round @"+s.state.username),console.log("set gameStatus to 2")},s.resultsCallback=function(e){null!==s.state.gameWinner&&!0===e?(s.setState({gameStatus:0,leavingGame:!1}),console.log("We have a game winner; set state=0 to start new game @"+s.state.username)):null===s.state.gameWinner&&!0===e?(s.setState({gameStatus:1}),console.log("No game winner yet; set state=1 to start next round @"+s.state.username)):(s.setState({gameStatus:0,leavingGame:!0}),console.log("set state=0 and @"+s.state.username+" is leaving the game"))},s.state={gameStatus:0,leavingGame:!1,rounds_played:0,all_players:{},tokens:{p1:0,p2:0,p3:0},roundWinner:" ",gameWinner:" ",userID:" ",username:" "},s.landingCallback=s.landingCallback.bind(Object(o.a)(s)),s.roundCallback=s.roundCallback.bind(Object(o.a)(s)),s.resultsCallback=s.resultsCallback.bind(Object(o.a)(s)),s.landingRef=n.a.createRef(),s.roundRef=n.a.createRef(),s}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;N.onopen=function(){console.log("WebSocket Client Connected"),N.send(JSON.stringify({type:"players"}))},N.onmessage=function(t){var a=JSON.parse(t.data);console.log(a),console.log(a.type),"playersS"===a.type?(e.landingRef.current.getPlayers(a),console.log("playersS received @"+e.state.username)):"startGame"===a.type?(e.landingRef.current.getStartGame(a),console.log("startGame received @"+e.state.username)):"turn"===a.type?(console.log("turn received @"+e.state.username),e.roundRef.current.getTurn(a),console.log("turn sent back to round @"+e.state.username)):"results"===a.type&&(console.log("results received @"+e.state.username),e.roundRef.current.getResults(a),console.log("results sent back to round @"+e.state.username))}}},{key:"render",value:function(){return 0===this.state.gameStatus?n.a.createElement(O,{ref:this.landingRef,leavingGame:this.state.leavingGame,gameCallback:this.landingCallback,socket:N,username:this.state.username}):1===this.state.gameStatus?n.a.createElement(P,{ref:this.roundRef,gameCallback:this.roundCallback,all_players:this.state.all_players,userID:this.state.userID,username:this.state.username,socket:N}):2===this.state.gameStatus?n.a.createElement(S,{points:this.state.tokens,allPlayers:this.state.all_players,winner:this.state.roundWinner,gameWinner:this.state.gameWinner,gameCallback:this.resultsCallback}):void 0}}]),a}(n.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(_,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},30:function(e,t,a){}},[[112,1,2]]]);
//# sourceMappingURL=main.eb755573.chunk.js.map