import { w3cwebsocket as W3CWebSocket } from "websocket"

const socket = new W3CWebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws")



export default socket;