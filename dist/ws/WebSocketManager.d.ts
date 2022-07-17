import { WebSocket } from 'ws';
import { type Client, type WebSocketOptions, WebSocketStatus } from '../';
export declare class WebSocketManager {
    socket: WebSocket;
    inflate: any;
    lastHeartbeat: number;
    lastHeartbeatAck: boolean;
    heartbeatInterval: number;
    sequence: number;
    sessionId: string | null;
    largeThresold: number;
    status: WebSocketStatus;
    client: Client | null;
    constructor({ largeThreshold }?: WebSocketOptions);
    connect(client: Client): void;
    disconnect(): void;
    reconnect(): void;
    identify(token: string, intents: number): void;
    pack(data: any): any;
    unpack(data: any): any;
    resolve(data: any): any;
    get endpoint(): string;
    get encoding(): "json" | "etf";
    isInflateFull(data: any): boolean;
}
