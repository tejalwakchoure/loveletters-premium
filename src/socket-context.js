import * as io from 'socket.io-client'

const socket = io({transports: ['websocket'], upgrade: false})

export default socket;