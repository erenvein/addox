"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const __1 = require("../");
class Client extends __1.BaseClient {
    intents;
    token;
    user;
    ws;
    constructor({ intents, ws }) {
        super();
        this.token = null;
        this.user = null;
        this.intents = new __1.BitField().set(intents);
        this.ws = new __1.WebSocketManager(ws);
    }
    login(token) {
        this.token = token;
        this.ws.connect(this);
    }
}
exports.Client = Client;
