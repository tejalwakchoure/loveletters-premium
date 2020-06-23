import { w3cwebsocket as W3CWebSocket } from "websocket"

const socket = new W3CWebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws")
socket.onclose = () => {
	console.log('WebSocket Client has closed');
	//Try to reconnect here
	
};


export default socket;