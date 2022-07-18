import type { GatewayIntentBits, Colors, PermissionFlagsBits } from './';

export interface ClientOptions {
    intents: GatewayIntentBitsResolvable;
    ws?: WebSocketOptions;
    shardCount?: number | 'auto';
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
