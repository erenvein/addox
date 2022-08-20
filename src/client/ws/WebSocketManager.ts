import { EventEmitter } from 'node:events';
import {
    WebSocketShard,
    Collection,
    type Client,
    type PresenceData,
    type WebSocketProperties,
    type Guild,
    BitField,
    GatewayIntentBitsResolver,
    WebSocketOptions,
    PresenceDataResolver,
    APIGatewayBotInfo,
    ReconnectableWebSocketCloseCodes,
    Sleep,
    type WebSocketEvents,
} from '../../index';

export declare interface WebSocketManager {
    on<K extends keyof WebSocketEvents>(event: K, listener: (...args: WebSocketEvents[K]) => void): this;
    once<K extends keyof WebSocketEvents>(
        event: K,
        listener: (...args: WebSocketEvents[K]) => void
    ): this;
    emit<K extends keyof WebSocketEvents>(event: K, ...args: WebSocketEvents[K]): any;
}

export class WebSocketManager extends EventEmitter {
    public intents: number;
    public client: Client;
    public largeThreshold: number;
    public presence: PresenceData | null;
    public compress: boolean;
    public properties: WebSocketProperties;
    public autoReconnect: boolean;
    #maximumIdentifyPerFiveSecond: number | null;
    #token: string | null;
    #shardList: number[] | null;
    #shardQueue: Set<WebSocketShard> | null;
    #spawnStreak: number;
    #shards = new Collection<number, WebSocketShard>();
    #shardCount: number | 'auto';

    public constructor(
        client: Client,
        {
            intents,
            shardCount,
            largeThreshold,
            presence,
            compress,
            properties,
            autoReconnect,
        }: WebSocketOptions
    ) {
        super();

        this.client = client;

        this.intents = new BitField().set(GatewayIntentBitsResolver(intents));
        this.#shardCount = shardCount ?? 'auto';
        this.largeThreshold = largeThreshold ?? 50;
        this.presence = presence ? PresenceDataResolver(presence) : null;
        this.#shardList = null;
        this.#shardQueue = null;
        this.compress = compress ?? true;
        this.properties = properties ?? {
            os: 'linux',
            browser: 'discord-api-wrapper-by-deliever42',
            device: 'discord-api-wrapper-by-deliever42',
        };
        this.#spawnStreak = 0;
        this.autoReconnect = autoReconnect ?? true;
        this.#token = null;
        this.#maximumIdentifyPerFiveSecond = null;
    }

    public get shards() {
        return this.#shards;
    }

    public get shardCount() {
        return this.#shardCount;
    }

    public get shardList() {
        return this.#shardList;
    }

    public get shardQueue() {
        return this.#shardQueue;
    }

    public get token() {
        return this.#token;
    }

    public get maximumIdentifyPerFiveSecond() {
        return this.#maximumIdentifyPerFiveSecond;
    }

    public async getGatewayBot() {
        return await this.client.rest.get<APIGatewayBotInfo>('/gateway/bot');
    }

    public get ping() {
        return Math.ceil(
            this.#shards.reduce((accumulator, shard) => (accumulator as any) + shard.ping, 0) /
                this.#shards.size
        );
    }

    public get guilds() {
        return this.#shards.reduce(
            (accumulator, shard) => (accumulator as any).concat(shard.guilds),
            new Collection<string, Guild>()
        );
    }

    public async connect(token: string) {
        token = token.replace(/^(Bot|Bearer)\s/iu, '');
        this.#token = token;
        this.client.rest.setToken(token);

        const { shards, session_start_limit } = await this.getGatewayBot();

        if (this.#shardCount === 'auto') {
            this.#shardCount = shards;
        } else if (this.#shardCount < 1) {
            this.#shardCount = 1;
        }

        this.#shardList = Array.from({ length: this.#shardCount }, (_, i) => i);

        this.#shardQueue = new Set<WebSocketShard>(
            this.#shardList?.map((id) => new WebSocketShard(this, id))
        );

        this.#maximumIdentifyPerFiveSecond = session_start_limit.max_concurrency;

        return await this.spawnShards();
    }

    public broadcast(data: any) {
        for (const shard of this.#shards.values()) {
            shard.send(data);
        }

        return true;
    }

    public async broadcastEval<T>(script: string) {
        const promises: T[] = [];

        for (const shard of this.#shards.values()) {
            promises.push(shard.eval<T>(script));
        }

        return await Promise.all(promises);
    }

    public destroy() {
        this.#shardList = null;
        this.#token = null;

        this.#shards.forEach((shard) => shard.close(1000, false, true));

        this.#shards.clear();
        this.#shardQueue?.clear();
    }

    public async spawnShards(): Promise<boolean> {
        if (!this.#shardQueue!.size) return false;

        const [shard] = this.#shardQueue!;
        this.#spawnStreak++;

        this.#shardQueue?.delete(shard);

        if (!shard.eventsAppended) {
            shard.on('ready', (shard) => {
                this.emit('shardReady', shard);

                if (this.allShardsReady) {
                    this.client.uptime = Date.now();
                    this.emit('ready', this.client);
                }
            });

            shard.on('resumed', (shard, replayed) => {
                this.emit('shardResumed', shard, replayed);
            });

            shard.on('error', (shard, error) => {
                this.emit('shardError', shard, error);
            });

            shard.on('close', (shard, code, reason) => {
                this.emit('shardClosed', shard, code, reason);

                if (ReconnectableWebSocketCloseCodes.has(code) && this.autoReconnect) {
                    this.emit('shardReconnect', shard);
                    shard.status = 'Reconnecting';

                    shard.cleanup();

                    this.respawn(shard.id);
                } else {
                    this.emit('shardDeath', shard, code, reason);
                }
            });

            shard.eventsAppended = true;
        }

        this.#shards.set(shard.id, shard);

        try {
            this.emit('shardSpawn', shard);
            await shard.connect();
        } catch {
            this.#shardQueue?.add(shard);
        }

        if (this.#shardQueue!.size) {
            await this.sleepForMaximumIdentifyPerFiveSecond();
            return await this.spawnShards();
        } else {
            this.#spawnStreak = 0;
        }

        return true;
    }

    public get allShardsReady() {
        if (
            this.#shards.size !== this.#shardCount ||
            !this.#shards.every((shard) => shard.uptime > 0) ||
            this.#shardQueue!.size
        )
            return false;

        return true;
    }

    public async sleepForMaximumIdentifyPerFiveSecond() {
        if (!this.#maximumIdentifyPerFiveSecond) {
            const { session_start_limit } = await this.getGatewayBot();
            this.#maximumIdentifyPerFiveSecond = session_start_limit.max_concurrency;
        }

        if (this.#spawnStreak >= this.#maximumIdentifyPerFiveSecond) {
            this.#spawnStreak = 0;
            return await Sleep(5000);
        } else {
            return;
        }
    }

    public async respawn(id: number) {
        if (!this.#shards.get(id)) return false;

        const shard = this.#shards.get(id)!;

        shard.close(1000, false, true);

        this.#shards.delete(id);
        this.#shardQueue?.add(shard);

        return await this.spawnShards();
    }

    public async respawnAll() {
        const token = this.#token;

        this.destroy();
        return await this.connect(token!);
    }
}
