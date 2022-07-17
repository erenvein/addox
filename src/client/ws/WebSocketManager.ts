import { WebSocket } from 'ws';
import {
    DISCORD_GATEWAY_URL,
    DISCORD_GATEWAY_VERSION,
    GatewayOpcodes,
    type Client,
    type WebSocketOptions,
    BaseWebSocketEvent,
} from '../..';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { TextDecoder } from 'node:util';

let erlpack: any;
let zlib: any;

try {
    erlpack = require('erlpack');
} catch {
    erlpack = null;
}

try {
    zlib = require('zlib-sync');
} catch {
    zlib = null;
}

export class WebSocketManager {
    public socket: WebSocket;
    public inflate: any = undefined;
    public lastPing: number = -1;
    public lastHeartbeatAck: boolean = false;
    public heartbeatInterval: NodeJS.Timer | null = null;
    public sequence: number = -1;
    public ping: number = -1;
    public sessionId: string | null = null;
    public largeThresold: number;
    public autoReconnect: boolean;
    public client: Client | null = null;

    public constructor({ largeThreshold, autoReconnect }: WebSocketOptions = {}) {
        this.largeThresold = largeThreshold ?? 50;
        this.autoReconnect = autoReconnect ?? true;

        this.socket = new WebSocket(this.endpoint);

        if (zlib) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : '',
                flush: zlib.Z_SYNC_FLUSH,
            });
        }
    }

    public async connect(client: Client) {
        this.client = client;

        for (const file of readdirSync(resolve(__dirname, 'events'))) {
            const mod = await import(`./events/${file}`).then((mod) => mod.default);

            if (mod !== undefined) {
                const event = new mod() as BaseWebSocketEvent;

                event.ws = this;
                this.socket.on(event.name, (data) => event.handle(data));
            }
        }
    }

    public disconnect() {}

    public reconnect() {}

    public heartbeat(ms: number) {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = setInterval(() => {
            this.socket.send(this.pack({ op: GatewayOpcodes.Heartbeat, d: this.sequence }));
            this.lastHeartbeatAck = false;
            this.lastPing = Date.now();
        }, ms);
    }

    public heartbeatAck() {
        this.lastHeartbeatAck = true;
        this.ping = Date.now() - this.lastPing;
    }

    public identify() {
        if (this.sessionId) {
            this.socket?.send(
                this.pack({
                    op: GatewayOpcodes.Resume,
                    d: {
                        token: this.client?.token!,
                        session_id: this.sessionId,
                        seq: this.sequence,
                    },
                })
            );
        } else {
            this.socket?.send(
                this.pack({
                    op: GatewayOpcodes.Identify,
                    d: {
                        token: this.client?.token!,
                        intents: this.client?.intents!,
                        large_threshold: this.largeThresold,
                        compress: this.encoding !== 'json',
                        properties: {
                            os: 'linux',
                            browser: 'discord-api-wrapper-by-deliever42',
                            device: 'discord-api-wrapper-by-deliever42',
                        },
                    },
                })
            );
        }
    }

    public pack(data: any) {
        if (this.encoding === 'json') {
            return JSON.stringify(data);
        } else {
            return erlpack.pack(data);
        }
    }

    public unpack(data: any) {
        if (this.encoding === 'json') {
            if (typeof data !== 'string') {
                data = new TextDecoder().decode(data);
            }

            return JSON.parse(data);
        } else {
            if (!Buffer.isBuffer(data)) {
                data = Buffer.from(new Uint8Array(data));
            }

            return erlpack.unpack(data);
        }
    }

    public resolve(data: any) {
        if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data);
        }

        if (zlib) {
            const isFlush = this.isInflateFlush(data);

            this.inflate.push(data, isFlush && zlib.Z_SYNC_FLUSH);

            if (!isFlush) return null;

            data = this.inflate.result;
        }

        try {
            data = this.unpack(data);
        } catch {
            data = null;
        }

        return data;
    }

    public get endpoint() {
        let baseEndpoint = DISCORD_GATEWAY_URL;

        baseEndpoint += `?v=${DISCORD_GATEWAY_VERSION}`;
        baseEndpoint += `&encoding=${this.encoding}`;

        if (zlib) {
            baseEndpoint += `&compress=zlib-stream`;
        }

        return baseEndpoint;
    }

    public get encoding() {
        return erlpack ? 'etf' : 'json';
    }

    public isInflateFlush(data: any) {
        return (
            data.length >= 4 &&
            data[data.length - 4] === 0x00 &&
            data[data.length - 3] === 0x00 &&
            data[data.length - 2] === 0xff &&
            data[data.length - 1] === 0xff
        );
    }
}
