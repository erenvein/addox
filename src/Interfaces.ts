import type {
    GatewayIntentBits,
    Colors,
    PermissionFlagsBits,
    Snowflake,
    GatewayActivityButton,
    GatewayActivityParty,
    GatewayActivityTimestamps,
    GatewayActivitySecrets,
    ActivityType,
    GatewayActivityEmoji,
    ActivityFlags,
    UserFlags,
    GuildMFALevel,
    Client,
    WebSocketShard,
    GatewayCloseCodes,
    APIGuild,
    Collection,
    Guild,
    GatewayDispatchEvents,
    GuildEmoji,
    GatewayActivityAssets,
    GuildSystemChannelFlags,
    GatewayGuildCreateDispatchData,
} from './';

import type { RequestInit } from 'node-fetch';

export type ArrayLike<T> = T | T[];

export type CollectionLike<K, V> = V | Collection<K, V>;

export interface ClientOptions {
    ws: WebSocketOptions;
    rest?: PartialRequestManagerOptions;
}

export interface WebSocketProperties {
    os?: string;
    browser?: string;
    device?: string;
}

export interface WebSocketOptions {
    largeThreshold?: number;
    autoReconnect?: boolean;
    presence?: PresenceData;
    shardCount?: number | 'auto';
    compress?: boolean;
    properties?: WebSocketProperties;
    intents: GatewayIntentBitsResolvable;
}

export type GatewayIntentBitsResolvable =
    | ArrayLike<number>
    | ArrayLike<keyof typeof GatewayIntentBits>;

export type PermissionFlagsBitsResolvable =
    | ArrayLike<number>
    | ArrayLike<keyof typeof PermissionFlagsBits>;

export type UserFlagsBitsResolvable = ArrayLike<number> | ArrayLike<keyof typeof UserFlags>;

export type ColorResolvable = number | keyof typeof Colors;

export type WebSocketEvents = 'open' | 'message' | 'error' | 'close';

export type SystemChannelFlagsBitsResolvable =
    | ArrayLike<number>
    | ArrayLike<keyof typeof GuildSystemChannelFlags>;

export interface RequestManagerOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    baseURL: string;
    authPrefix?: 'Bot' | 'Bearer';
    retries?: number;
}

export interface RequestOptions extends RequestInit {
    reason?: string;
}

export interface PartialRequestManagerOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    authPrefix?: 'Bot' | 'Bearer';
    retries?: number;
}

export interface RateLimitData {
    limited: boolean;
    scope?: 'user' | 'shared' | 'global';
    limit?: number;
    remaining?: number;
    reset?: number;
    retry?: number;
    route?: `/${string}`;
}

export interface ImageOptions {
    format?: 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' | 'json';
    size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192;
    dynamic?: boolean;
}

export type ActivityTypeResolvable = keyof typeof ActivityType | number;

export type ActivityFlagsResolvable = keyof typeof ActivityFlags | number;

export interface Activity {
    name: string;
    type?: ActivityTypeResolvable;
    url?: string;
    created_at?: number;
    timestamps?: GatewayActivityTimestamps[];
    application_id?: Snowflake;
    details?: string;
    state?: string;
    emoji?: GatewayActivityEmoji[];
    party?: GatewayActivityParty[];
    assets?: GatewayActivityAssets[];
    secrets?: GatewayActivitySecrets[];
    instance?: boolean;
    flags?: ActivityFlagsResolvable;
    buttons?: GatewayActivityButton[];
}

export interface PresenceData {
    activities?: Activity[];
    status?: 'online' | 'idle' | 'dnd' | 'invisible' | 'offline';
    afk?: boolean;
    since?: number;
}

export type GatewayCloseCodesResolvable = number | keyof typeof GatewayCloseCodes;

export type WebSocketShardStatus = 'IDLE' | 'READY' | 'CONNECTING' | 'RECONNECTING' | 'CLOSED';

export interface APIGuildWithShard extends APIGuild {
    shard_id?: number;
}

export interface GatewayGuildCreateDispatchDataWithShard extends GatewayGuildCreateDispatchData {
    shard_id?: number;
}

export interface ClientUserEditData {
    username?: string;
    avatar?: string;
}
export interface FetchGuildOptions extends FetchOptions {
    with_counts?: boolean;
}

export interface FetchOptions {
    force?: boolean;
}

export interface RoleData {
    name?: string;
    permissions?: PermissionFlagsBitsResolvable;
    color?: ColorResolvable;
    hoist?: boolean;
    icon?: string;
    unicode_emoji?: string;
    mentionable?: boolean;
}

export interface RoleTags {
    botId?: string | null;
    integrationId?: string | null;
    premiumSubscriber?: true | null;
}

export type GuildMFALevelResolvable = keyof typeof GuildMFALevel | number;

export interface GuildFetchPruneOptions {
    days?: number;
    includeRoles?: 'none' | Snowflake[];
}

export interface ClientEvents {
    Ready: [client: Client];
    GuildCreate: [guild: Guild];
    GuildDelete: [guild: Guild];
    EmojiCreate: [emoji: GuildEmoji];
    EmojiDelete: [emoji: GuildEmoji];
    EmojiUpdate: [oldEmoji: GuildEmoji, newEmoji: GuildEmoji];
    Raw: [eventName: keyof typeof GatewayDispatchEvents, data: any];
    ShardSpawn: [shard: WebSocketShard];
    ShardReady: [shard: WebSocketShard];
    ShardClosed: [shard: WebSocketShard, code: number, reason: string];
    ShardDeath: [shard: WebSocketShard, code: number, reason: string];
    ShardReconnect: [shard: WebSocketShard];
    ShardResumed: [shard: WebSocketShard, replayed: number];
    ShardError: [shard: WebSocketShard, error: any];
}

export interface WebSocketShardEvents {
    Ready: [shard: WebSocketShard];
    Close: [shard: WebSocketShard, code: number, reason: string];
    Resumed: [shard: WebSocketShard, replayed: number];
    Error: [shard: WebSocketShard, error: any];
}
