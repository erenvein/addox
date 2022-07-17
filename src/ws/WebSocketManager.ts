import { WebSocket } from 'ws';
import {
    DISCORD_GATEWAY_URL,
    DISCORD_GATEWAY_VERSION,
    type Client,
    type WebSocketOptions,
    GatewayOpcodes
} from '../';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

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
    public lastHeartbeat: number = -1;
    public lastHeartbeatAck: boolean = false;
    public heartbeatInterval: number = -1;
    public sequence: number = -1;
    public sessionId: string | null = null;
    public largeThresold: number;
    public client: Client | null = null;

    public constructor({ largeThreshold }: WebSocketOptions = {}) {
        this.largeThresold = largeThreshold ?? 50;

        this.socket = new WebSocket(this.endpoint);

        if (zlib) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : undefined,
            });
        }
    }

    public async connect(client: Client) {
        this.client = client;

        for (const file of readdirSync(resolve(__dirname, 'events'))) {
            const mod = await import(`./events/${file}`).then((mod) => mod.default);

            if (mod !== undefined) {
                const event = new mod();

                event.ws = this;
                this.socket.on(event.name, event.handle);
            }
        }
    }

    public disconnect() {}

    public reconnect() {}

    public identify(token: string, intents: number) {
        this.socket?.send(
            this.pack({
                op: GatewayOpcodes.Identify,
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
            })
        );
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
            return JSON.parse(data);
        } else {
            return erlpack.unpack(data);
        }
    }

    public resolve(data: any) {
        let raw = data;

        if (zlib) {
            const isFull = this.isInflateFull(data);

            this.inflate.push(data, isFull && zlib.Z_SYNC_FLUSH);

            if (!isFull) return null;

            raw = this.inflate.result;
        }

        try {
            raw = this.unpack(data);
        } catch {
            raw = null;
        }

        return raw;
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

    public isInflateFull(data: any) {
        return (
            data.length >= 4 &&
            data[data.length - 4] === 0x00 &&
            data[data.length - 3] === 0x00 &&
            data[data.length - 2] === 0xff &&
            data[data.length - 1] === 0xff
        );
    }
}
