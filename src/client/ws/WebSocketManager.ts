import {
    WebSocketShard,
    Collection,
    type Client,
    type PresenceData,
    BitField,
    GatewayIntentBitsResolver,
    WebSocketOptions,
    PresenceDataResolver,
    APIGatewayBotInfo,
    ReconnectableWebSocketErrorCodes,
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

    public constructor(
        client: Client,
        { intents, shardCount, largeThreshold, presence, compress }: WebSocketOptions
    ) {
        this.client = client;

        this.intents = new BitField().set(GatewayIntentBitsResolver(intents));
        this.shardCount = shardCount ?? 'auto';
        this.largeThreshold = largeThreshold ?? 250;
        this.presence = presence ? PresenceDataResolver(presence) : null;
        this.shardList = null;
        this.shardQueue = null;
        this.compress = compress ?? true;
    }

    public async getGatewayBot() {
        return await this.client.rest.get<APIGatewayBotInfo>('/gateway/bot');
    }

    public async connect(token: string) {
        this.client.token = token;
        this.client.rest.setToken(token);

        if (this.shardCount === 'auto') {
            const { shards } = await this.getGatewayBot();

            this.shardCount = shards;
        } else if (this.shardCount < 1) {
            this.shardCount = 1;
        }

        this.shardList = Array.from({ length: this.shardCount }, (_, i) => i);

        this.shardQueue = new Set<WebSocketShard>(
            this.shardList?.map((id) => new WebSocketShard(this, id))
        );

        return await this.spawnShards();
    }

    public broadcast(data: any) {
        this.shards.forEach((shard) => shard.send(data));
    }

    public async destroy() {
        this.shards.forEach((shard) => shard.close(1000));
    }

    public async spawnShards(): Promise<boolean> {
        if (!this.shardQueue!.size) return false;

        const [shard] = this.shardQueue!;

        this.client.emit('ShardSpawn', shard);

        this.shardQueue?.delete(shard);

        if (!shard.eventsReady) {
            shard.on('Ready', (...args) => {
                this.client.emit('ShardReady', ...args);

                if (this.allShardsReady) {
                    this.client.uptime = Date.now();
                    this.client.emit('Ready', this.client);
                }
            });

            shard.on('Close', (...args) => {
                this.client.emit('ShardDisconnect', ...args);

                if (ReconnectableWebSocketErrorCodes.has(args[1])) {
                    this.shardQueue?.add(shard);

                    this.client.emit('ShardReconnect', args[0]);
                }
            });

            shard.on('Resumed', (...args) => {
                this.client.emit('ShardResumed', ...args);
            });

            shard.on('Error', (...args) => {
                this.client.emit('ShardError', ...args);
            });

            shard.eventsReady = true;
        }

        this.shards.set(shard.id, shard);

        try {
            await shard.connect();
        } catch (err) {
            this.shardQueue?.add(shard);
        }

        if (this.shardQueue!.size) {
            await Sleep(4000);
            return await this.spawnShards();
        }

        return true;
    }

    public get allShardsReady() {
        if (
            this.shards.size !== this.shardCount ||
            !this.shards.every((shard) => shard.readyTimestamp > 0)
        )
            return false;

        return true;
    }
}
