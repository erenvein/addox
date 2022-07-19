import type { WebSocketEvents, WebSocketShard } from '../../..';

export class BaseWebSocketEvent {
    public name: WebSocketEvents;
    public shard!: WebSocketShard;
    public constructor(name: WebSocketEvents) {
        this.name = name;
    }

    public handle(...args: any[]) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
