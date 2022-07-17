export interface ClientOptions {
    intents: number | number[];
    ws?: WebSocketOptions;
}

export interface WebSocketOptions {
    largeThreshold?: number;
    autoReconnect?: boolean;
}

export type WebSocketEvents = 'open' | 'message' | 'error' | 'close';
