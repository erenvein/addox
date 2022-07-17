export interface ClientOptions {
    intents: number | number[];
    ws?: WebSocketOptions;
}

export interface WebSocketOptions {
    largeThreshold?: number;
}

export type WebSocketEvents = 'open' | 'message' | 'error' | 'close';