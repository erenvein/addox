import type { GatewayIntentBits, Colors, PermissionFlagsBits } from './';

export interface ClientOptions {
    intents: GatewayIntentBitsResolvable;
    shardCount?: number | 'auto';
    ws?: WebSocketOptions;
    rest?: PartialRESTOptions;
}

export interface WebSocketOptions {
    largeThreshold?: number;
    autoReconnect?: boolean;
}

export type GatewayIntentBitsResolvable =
    | number
    | number[]
    | keyof typeof GatewayIntentBits
    | (keyof typeof GatewayIntentBits)[];

export type PermissionFlagsBitsResolvable =
    | number
    | number[]
    | keyof typeof PermissionFlagsBits
    | (keyof typeof PermissionFlagsBits)[];

export type ColorResolvable = number | keyof typeof Colors;

export type WebSocketEvents = 'open' | 'message' | 'error' | 'close';

export interface RESTOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    baseURL: string;
    authPrefix?: 'Bot' | 'Bearer';
}

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
