"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
const ws_1 = require("ws");
const __1 = require("../");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
let erlpack;
let zlib;
try {
    erlpack = require('erlpack');
}
catch {
    erlpack = null;
}
try {
    zlib = require('zlib-sync');
}
catch {
    zlib = null;
}
class WebSocketManager {
    socket;
    inflate = undefined;
    lastHeartbeat = -1;
    lastHeartbeatAck = false;
    heartbeatInterval = -1;
    sequence = -1;
    sessionId = null;
    largeThresold;
    status = 'DISCONNECTED';
    client = null;
    constructor({ largeThreshold } = {}) {
        this.largeThresold = largeThreshold ?? 50;
        this.socket = new ws_1.WebSocket(this.endpoint);
        if (zlib) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : undefined,
            });
        }
    }
    connect(client) {
        this.status = 'CONNECTING';
        this.client = client;
        for (const file of (0, node_fs_1.readdirSync)((0, node_path_1.resolve)(__dirname, 'events'))) {
            const event = new (require((0, node_path_1.resolve)(__dirname, 'events', file)))();
            event.ws = this;
            this.socket.on(event.name, event.handle);
        }
    }
    disconnect() { }
    reconnect() { }
    identify(token, intents) {
        this.socket?.send(this.pack({
            op: __1.GatewayOpcodes.Identify,
            d: {
                token,
                intents,
                large_threshold: this.largeThresold,
                compress: this.encoding !== 'json',
                properties: {
                    os: 'linux',
                    browser: 'discord-api-wrapper-by-deliever42',
                    device: 'discord-api-wrapper-by-deliever42',
                },
            },
        }));
    }
    pack(data) {
        if (this.encoding === 'json') {
            return JSON.stringify(data);
        }
        else {
            return erlpack.pack(data);
        }
    }
    unpack(data) {
        if (this.encoding === 'json') {
            return JSON.parse(data);
        }
        else {
            return erlpack.unpack(data);
        }
    }
    resolve(data) {
        let raw = data;
        if (zlib) {
            const isFull = this.isInflateFull(data);
            this.inflate.push(data, isFull && zlib.Z_SYNC_FLUSH);
            if (!isFull)
                return null;
            raw = this.inflate.result;
        }
        try {
            raw = this.unpack(data);
        }
        catch {
            raw = null;
        }
        return raw;
    }
    get endpoint() {
        let baseEndpoint = __1.DISCORD_GATEWAY_URL;
        baseEndpoint += `?v=${__1.DISCORD_GATEWAY_VERSION}`;
        baseEndpoint += `&encoding=${this.encoding}`;
        if (zlib) {
            baseEndpoint += `&compress=zlib-stream`;
        }
        return baseEndpoint;
    }
    get encoding() {
        return erlpack ? 'etf' : 'json';
    }
    isInflateFull(data) {
        return (data.length >= 4 &&
            data[data.length - 4] === 0x00 &&
            data[data.length - 3] === 0x00 &&
            data[data.length - 2] === 0xff &&
            data[data.length - 1] === 0xff);
    }
}
exports.WebSocketManager = WebSocketManager;
