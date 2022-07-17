import type { WebSocketEvents, WebSocketManager } from '../../';

export class BaseWebSocketEvent {
    public name: WebSocketEvents;
    public ws!: WebSocketManager;
    public constructor(name: WebSocketEvents) {
        this.name = name;
    }

    public handle(data: any) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
