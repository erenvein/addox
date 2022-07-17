export interface ClientOptions {
    intents: number | number[];
    ws?: WebSocketOptions;
}
export interface WebSocketOptions {
    largeThreshold?: number;
}
export declare type WebSocketEvents = 'open' | 'message' | 'error' | 'close';
export declare type WebSocketStatus = 'DISCONNECTING' | 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING';
