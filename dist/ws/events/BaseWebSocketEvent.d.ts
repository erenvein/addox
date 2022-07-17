import type { WebSocketEvents, WebSocketManager } from '../../';
export declare class BaseWebSocketEvent {
    name: WebSocketEvents;
    ws: WebSocketManager;
    constructor(name: WebSocketEvents);
    handle(data: any): void;
}
