"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebSocketEvent = void 0;
class BaseWebSocketEvent {
    name;
    ws;
    constructor(name) {
        this.name = name;
    }
    handle(data) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
exports.BaseWebSocketEvent = BaseWebSocketEvent;
