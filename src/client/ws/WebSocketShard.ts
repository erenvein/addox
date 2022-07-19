import { WebSocket } from 'ws';
import {
    DiscordGatewayURL,
    DiscordGatewayVersion,
    GatewayOpcodes,
    WebSocketShardEvents,
    type WebSocketManager,
    BaseWebSocketEvent,
    GatewayCloseCodes,
} from '../..';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { TextDecoder } from 'node:util';
import { EventEmitter } from 'node:events';

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

export class WebSocketShard extends EventEmitter {
    public socket: WebSocket;
    public inflate: any = undefined;
    public lastHeartbeatAck: number = -1;
    public lastHeartbeatAcked: boolean = false;
    public lastPing: number = -1;
    public heartbeatInterval: NodeJS.Timer | null = null;
    public sequence: number = -1;
    public closeSequence: number = 0;
    public sessionId: string | null = null;
    public manager: WebSocketManager;
    public id: number;
    public eventsReady: boolean = false;
    public readyTimestamp: number = -1;

    public constructor(manager: WebSocketManager, id: number) {
        super();

        this.manager = manager;
        this.id = id;
        this.socket = new WebSocket(this.endpoint);

        if (zlib) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : '',
                flush: zlib.Z_SYNC_FLUSH,
            });
        }
    }

    public get ping() {
        return this.lastHeartbeatAck - this.lastPing;
    }

    public async connect() {
        if (this.readyTimestamp > 0) {
            return Promise.resolve();
        }

        for (const file of readdirSync(resolve(__dirname, 'events'))) {
            const mod = await import(`./events/${file}`).then((mod) => mod.default);

            if (mod !== undefined) {
                const event = new mod() as BaseWebSocketEvent;

                event.shard = this;
                this.socket.on(event.name, (...args) => event.handle(...args));
            }
        }
    }

    public close(code?: keyof typeof GatewayCloseCodes | number) {
        clearInterval(this.heartbeatInterval!);

        this.lastHeartbeatAck = -1;
        this.sequence = -1;
        this.sessionId = null;
        this.manager.client!.user = null;
        this.inflate = null;
        this.readyTimestamp = -1;

        if (zlib) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : '',
                flush: zlib.Z_SYNC_FLUSH,
            });
        }

        if (typeof code === 'string') {
            code = GatewayCloseCodes[code];
        }

        this.socket.close(code);
    }

    public async reconnect() {
        this.close(GatewayCloseCodes.UnknownError);
        await this.connect();
    }

    public resume() {
        this.emit('Resumed', this);
        this.send({
            op: GatewayOpcodes.Resume,
            d: {
                token: this.manager.client?.token!,
                session_id: this.sessionId,
                seq: this.closeSequence,
            },
        });
    }

    public heartbeat(ms: number) {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = setInterval(() => {
            this.send({ op: GatewayOpcodes.Heartbeat, d: this.sequence });
            this.lastHeartbeatAcked = false;
            this.lastPing = Date.now();
        }, ms);
    }

    public heartbeatAck() {
        this.lastHeartbeatAck = Date.now();
        this.lastHeartbeatAcked = true;
    }

    public identify() {
        if (this.sessionId) {
            this.resume();
        } else {
            this.send({
                op: GatewayOpcodes.Identify,
                d: {
                    token: this.manager.client?.token!,
                    intents: this.manager.client?.ws.intents!,
                    large_threshold: this.manager.largeThreshold,
                    compress: this.manager.compress,
                    presence: this.manager.presence,
                    properties: {
                        os: 'linux',
                        browser: 'discord-api-wrapper-by-deliever42',
                        device: 'discord-api-wrapper-by-deliever42',
                    },
                    shard: [this.id, this.manager.shardCount],
                },
            });
        }
    }

    public get pack() {
        return this.encoding === 'json' ? JSON.stringify : erlpack.pack;
    }

    public send(data: any) {
        this.socket?.send(this.pack(data));
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

    public deserialize(data: any) {
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
        let baseEndpoint = DiscordGatewayURL;

        baseEndpoint += `?v=${DiscordGatewayVersion}`;
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

    public override on<K extends keyof WebSocketShardEvents>(
        event: K,
        listener: (...args: WebSocketShardEvents[K]) => void
    ): this;
    public override on(event: string | symbol, ...args: any[]): this;
    public override on(event: string | symbol, listener: (...args: any) => any) {
        super.on(event, listener);
        return this;
    }

    public override once<K extends keyof WebSocketShardEvents>(
        event: K,
        listener: (...args: WebSocketShardEvents[K]) => void
    ): this;
    public override once(event: string | symbol, ...args: any[]): this;
    public override once(event: string | symbol, listener: (...args: any) => any) {
        super.once(event, listener);
        return this;
    }

    public override emit<K extends keyof WebSocketShardEvents>(
        event: K,
        ...args: WebSocketShardEvents[K]
    ): boolean;
    public override emit(event: string | symbol, ...args: any[]): boolean;
    public override emit(event: string | symbol, ...args: any[]) {
        return super.emit(event, ...args);
    }
}
