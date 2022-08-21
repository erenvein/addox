import { WebSocket } from 'ws';
import {
    DiscordGatewayURL,
    DiscordGatewayVersion,
    GatewayOpcodes,
    WebSocketShardEvents,
    type WebSocketManager,
    type GatewayCloseCodesResolvable,
    type PresenceData,
    type Guild,
    BaseWebSocketEvent,
    GatewayCloseCodes,
    Collection,
    WebSocketShardStatus,
    Sleep,
    PresenceDataResolver,
} from '../../index';
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

export declare interface WebSocketShard {
    on<K extends keyof WebSocketShardEvents>(
        event: K,
        listener: (...args: WebSocketShardEvents[K]) => void
    ): this;
    once<K extends keyof WebSocketShardEvents>(
        event: K,
        listener: (...args: WebSocketShardEvents[K]) => void
    ): this;
    emit<K extends keyof WebSocketShardEvents>(event: K, ...args: WebSocketShardEvents[K]): any;
}

export class WebSocketShard extends EventEmitter {
    public socket: WebSocket | null;
    public inflate: any = undefined;
    public lastHeartbeat: number = -1;
    public lastHeartbeatAcked: boolean = false;
    public lastHeartbeatAck: number = -1;
    public heartbeatInterval: NodeJS.Timer | null = null;
    public sequence: number = -1;
    public closeSequence: number = 0;
    public sessionId: string | null = null;
    public manager: WebSocketManager;
    public id: number;
    public eventsAppended: boolean = false;
    public uptime: number = -1;
    public status: WebSocketShardStatus = 'Idle';
    public packetQueue: number = 0;
    public guilds = new Collection<string, Guild>();

    public constructor(manager: WebSocketManager, id: number) {
        super();

        this.manager = manager;
        this.id = id;
        this.socket = null;

        if (!!zlib && this.manager.compress) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : '',
                flush: zlib.Z_SYNC_FLUSH,
            });
        }
    }

    public get ping() {
        return this.lastHeartbeatAck - this.lastHeartbeat;
    }

    public async connect() {
        if (
            this.socket &&
            this.uptime > 0 &&
            this.status === 'Ready' &&
            this.socket?.readyState === WebSocket.OPEN
        ) {
            return;
        }

        this.status = 'Connecting';

        this.socket = new WebSocket(this.endpoint, { handshakeTimeout: 30000 });

        for (const file of readdirSync(resolve(__dirname, 'events'))) {
            const mod = await import(`./events/${file}`).then((mod) => mod.default);

            if (mod !== undefined) {
                const event = new mod() as BaseWebSocketEvent;

                event.shard = this;
                this.socket.on(event.name, (...args) => event.handle(...args));
            }
        }
    }

    public cleanup() {
        clearInterval(this.heartbeatInterval!);

        this.lastHeartbeat = -1;
        this.lastHeartbeatAck = -1;
        this.lastHeartbeatAcked = false;
        this.sequence = -1;
        this.sessionId = null;
        this.manager.client!.user = null;
        this.inflate = null;
        this.uptime = -1;
        this.eventsAppended = false;

        this.guilds.clear();

        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket = null;
        }

        this.removeAllListeners();

        if (!!zlib && this.manager.compress) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : '',
                flush: zlib.Z_SYNC_FLUSH,
            });
        }
    }

    public close(
        code?: GatewayCloseCodesResolvable,
        emit: boolean = true,
        cleanup: boolean = true
    ) {
        if (typeof code === 'string') {
            code = GatewayCloseCodes[code];
        }

        if (cleanup) {
            this.cleanup();
        }

        this.socket?.close(emit ? code : undefined);
    }

    public async reconnect(emit: boolean = true) {
        this.close(GatewayCloseCodes.UnknownError, emit, true);
        await this.connect();
    }

    public resume() {
        if (!this.sessionId) {
            this.identify();
        } else {
            this.send({
                op: GatewayOpcodes.Resume,
                d: {
                    token: this.manager.token!,
                    session_id: this.sessionId,
                    seq: this.closeSequence,
                },
            });
        }
    }

    public setHeartbeatTimer(ms: number) {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, ms);
    }

    public sendHeartbeat() {
        this.lastHeartbeatAcked = false;
        this.lastHeartbeat = Date.now();

        this.send({ op: GatewayOpcodes.Heartbeat, d: this.sequence });
    }

    public heartbeatAck(updatePing: boolean = false) {
        this.lastHeartbeatAcked = true;

        if (updatePing) {
            this.lastHeartbeatAck = Date.now();
        }
    }

    public identify() {
        if (this.sessionId) {
            this.resume();
        } else {
            this.send({
                op: GatewayOpcodes.Identify,
                d: {
                    token: this.manager.token!,
                    intents: this.manager.client?.ws.intents!,
                    large_threshold: this.manager.largeThreshold,
                    compress: !!zlib && this.manager.compress,
                    presence: this.manager.presence,
                    properties: this.manager.properties,
                },
            });
        }
    }

    public get pack() {
        return this.encoding === 'json' ? JSON.stringify : erlpack.pack;
    }

    private _send(data: any) {
        if (this.socket) {
            this.socket.send(this.pack(data));
        }
    }

    public send(data: any) {
        if (++this.packetQueue > 2) {
            Sleep(1150).then(() => {
                this._send(data);
                this.packetQueue--;
            });
        } else {
            this._send(data);
            this.packetQueue--;
        }
    }

    public setPresence(data: PresenceData) {
        this.send({
            op: GatewayOpcodes.PresenceUpdate,
            d: PresenceDataResolver(data),
        });
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

        if (!!zlib && this.manager.compress) {
            const isFlush = this.isFlush(data);

            this.inflate.push(data, isFlush && zlib.Z_SYNC_FLUSH);

            if (!isFlush) return null;

            data = this.inflate.result;
        }

        try {
            data = this.unpack(data);
        } catch (err) {
            data = null;
        }

        return data;
    }

    public get endpoint() {
        let baseEndpoint = DiscordGatewayURL;

        baseEndpoint += `?v=${DiscordGatewayVersion}`;
        baseEndpoint += `&encoding=${this.encoding}`;

        if (!!zlib && this.manager.compress) {
            baseEndpoint += `&compress=zlib-stream`;
        }

        return baseEndpoint;
    }

    public get encoding() {
        return erlpack ? 'etf' : 'json';
    }

    public isFlush(data: any) {
        return (
            data.length >= 4 &&
            data[data.length - 4] === 0x00 &&
            data[data.length - 3] === 0x00 &&
            data[data.length - 2] === 0xff &&
            data[data.length - 1] === 0xff
        );
    }

    public eval<T>(script: string): T {
        return eval(script);
    }
}
