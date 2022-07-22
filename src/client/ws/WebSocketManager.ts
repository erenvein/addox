import {
    WebSocketShard,
    Collection,
    type Client,
    type PresenceData,
    type WebSocketProperties,
    type Guild,
    type APIGatewaySessionStartLimit,
    BitField,
    GatewayIntentBitsResolver,
    WebSocketOptions,
    PresenceDataResolver,
    APIGatewayBotInfo,
    ReconnectableWebSocketCloseCodes,
    Sleep,
} from '../../';

export class WebSocketManager {
    public shards = new Collection<number, WebSocketShard>();
    public shardCount: number | 'auto';
    public intents: number;
    public client: Client;
    public largeThreshold: number;
    public presence: PresenceData | null;
    public shardList: number[] | null;
    public shardQueue: Set<WebSocketShard> | null;
    public compress: boolean;
    public properties: WebSocketProperties;
    public spawnStreak: number;

    public constructor(
        client: Client,
        { intents, shardCount, largeThreshold, presence, compress, properties }: WebSocketOptions
    ) {
        this.client = client;

        this.intents = new BitField().set(GatewayIntentBitsResolver(intents));
        this.shardCount = shardCount ?? 'auto';
        this.largeThreshold = largeThreshold ?? 50;
        this.presence = presence ? PresenceDataResolver(presence) : null;
        this.shardList = null;
        this.shardQueue = null;
        this.compress = compress ?? true;
        this.properties = properties ?? {
            os: 'linux',
            browser: 'discord-api-wrapper-by-deliever42',
            device: 'discord-api-wrapper-by-deliever42',
        };
        this.spawnStreak = 0;
    }

    public async getGatewayBot() {
        return await this.client.rest.get<APIGatewayBotInfo>('/gateway/bot');
    }

    public get ping() {
        return (
            this.shards.reduce((accumulator, shard) => (accumulator as any) + shard.ping, 0) /
            this.shards.size
        );
    }

    public get guilds() {
        return this.shards.reduce(
            (accumulator, shard) => (accumulator as any).concat(shard.guilds),
            new Collection<string, Guild>()
        );
    }

    public async connect(token: string) {
        token = token.replace(/^(Bot|Bearer)\s/iu, '');
        this.client.token = token;
        this.client.rest.setToken(token);

        const { shards, session_start_limit } = await this.getGatewayBot();

        if (this.shardCount === 'auto') {
            this.shardCount = shards;
        } else if (this.shardCount < 1) {
            this.shardCount = 1;
        }

        this.shardList = Array.from({ length: this.shardCount }, (_, i) => i);

        this.shardQueue = new Set<WebSocketShard>(
            this.shardList?.map((id) => new WebSocketShard(this, id))
        );

        await this.sleepForSessionStartLimit(session_start_limit);

        return await this.spawnShards();
    }

    public broadcast(data: any) {
        for (const shard of this.shards.values()) {
            shard.send(data);
        }

        return true;
    }

    public broadcastEval<T>(script: string): T[] {
        const result: T[] = [];

        for (const shard of this.shards.values()) {
            result.push(shard.eval<T>(script));
        }

        return result;
    }

    public destroy() {
        this.shardList = null;

        this.shards.forEach((shard) => shard.close(1000));

        this.shards.clear();
        this.shardQueue?.clear();
    }

    public async spawnShards(): Promise<boolean> {
        if (!this.shardQueue!.size) return false;

        const [shard] = this.shardQueue!;

        this.spawnStreak++;

        this.shardQueue?.delete(shard);

        if (!shard.eventsReady) {
            shard.on('ready', (shard) => {
                this.client.emit('shardReady', shard);

                if (this.allShardsReady) {
                    this.client.uptime = Date.now();
                    this.client.emit('ready', this.client);
                }
            });

            shard.on('resumed', (shard, replayed) => {
                this.client.emit('shardResumed', shard, replayed);
            });

            shard.on('error', (shard, error) => {
                this.client.emit('shardError', shard, error);
            });

            shard.on('close', (shard, code, reason) => {
                this.client.emit('shardClosed', shard, code, reason);

                if (ReconnectableWebSocketCloseCodes.has(code)) {
                    this.client.emit('shardReconnect', shard);
                    shard.status = 'RECONNECTING';

                    if (shard.sessionId) {
                        shard.resume();
                    } else {
                        shard.cleanup();
                        this.shardQueue?.add(shard);
                    }
                } else {
                    this.client.emit('shardDeath', shard, code, reason);
                }
            });

            shard.eventsReady = true;
        }

        this.shards.set(shard.id, shard);

        try {
            this.client.emit('shardSpawn', shard);
            await shard.connect();
        } catch (error) {
            this.shardQueue?.add(shard);
        }

        if (this.shardQueue!.size) {
            await this.sleepForSessionStartLimit();
            return await this.spawnShards();
        } else {
            this.spawnStreak = 0;
        }

        return true;
    }

    public get allShardsReady() {
        if (this.shards.size !== this.shardCount || !this.shards.every((shard) => shard.uptime > 0))
            return false;

        return true;
    }

    public async sleepForSessionStartLimit(sessionStartLimit?: APIGatewaySessionStartLimit) {
        let maxConcurrency: number;

        if (sessionStartLimit) {
            maxConcurrency = sessionStartLimit.max_concurrency;
        } else {
            const { session_start_limit } = await this.getGatewayBot();
            maxConcurrency = session_start_limit.max_concurrency;
        }

        if (this.spawnStreak >= maxConcurrency) {
            this.spawnStreak = 0;
            return await Sleep(5000);
        }
    }

    public async respawn(id: number) {
        if (!this.shards.get(id)) return false;

        const shard = this.shards.get(id)!;

        shard.close(1000, false);

        this.shards.delete(id);
        this.shardQueue?.add(shard);
        return await this.spawnShards();
    }

    public async respawnAll() {
        this.shards.forEach((shard) => shard.close(1000, false));

        this.shards.clear();
        this.shardQueue?.clear();

        return await this.connect(this.client.token!);
    }
}
