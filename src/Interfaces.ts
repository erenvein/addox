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
    UserPremiumType,
    Client,
} from './';

import type { RequestInit } from 'node-fetch';

export type ArrayLike<T> = T | T[];

export type PromiseLike<T> = T | Promise<T>;

export interface ClientOptions {
    intents: GatewayIntentBitsResolvable;
    shardCount?: number | 'auto';
    ws?: WebSocketOptions;
    rest?: PartialRESTOptions;
}

export interface WebSocketOptions {
    largeThreshold?: number;
    autoReconnect?: boolean;
    presence?: PresenceData;
}

export type GatewayIntentBitsResolvable =
    | ArrayLike<number>
    | ArrayLike<keyof typeof GatewayIntentBits>;

export type PermissionFlagsBitsResolvable =
    | ArrayLike<number>
    | ArrayLike<keyof typeof PermissionFlagsBits>;

export type UserFlagsBitsResolvable = ArrayLike<number> | ArrayLike<keyof typeof UserFlags>;

export type UserPremiumTypeResolvable = number | keyof typeof UserPremiumType;

export type ColorResolvable = number | keyof typeof Colors;

export type WebSocketEvents = 'open' | 'message' | 'error' | 'close';

export interface RESTOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    baseURL: string;
    authPrefix?: 'Bot' | 'Bearer';
    retries?: number;
}

export type RequestOptions = RequestInit & { reason?: string };

export interface PartialRESTOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    authPrefix?: 'Bot' | 'Bearer';
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
    format?: 'png' | 'jpg' | 'webp' | 'gif';
    size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192;
    dynamic?: boolean;
}

export interface ActivityAssets {
    largeImage?: string;
    largeText?: string;
    smallImage?: string;
    smallText?: string;
}

export type ActivityTypeResolvable = keyof typeof ActivityType | number;

export type ActivityFlagsResolvable = keyof typeof ActivityFlags | number;

export interface Activity {
    name: string;
    type?: ActivityTypeResolvable;
    url?: string;
    createdAt?: number;
    timestamps?: GatewayActivityTimestamps[];
    applicationId?: Snowflake;
    details?: string;
    state?: string;
    emoji?: GatewayActivityEmoji[];
    party?: GatewayActivityParty[];
    assets?: ActivityAssets[];
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

export interface ClientEvents {
    Ready: [client: Client];
    Raw: [data: any];
}
