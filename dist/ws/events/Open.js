"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketOpenEvent = void 0;
const __1 = require("../../");
class WebSocketOpenEvent extends __1.BaseWebSocketEvent {
    constructor() {
        super('open');
    }
    handle() {
        this.ws.status = 'CONNECTED';
        this.ws.socket.ping();
    }
}
exports.WebSocketOpenEvent = WebSocketOpenEvent;
