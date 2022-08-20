import type { WebSocketShardEvents, WebSocketShard } from '../../../index';

export class BaseWebSocketEvent {
    public name: keyof WebSocketShardEvents;
    public shard!: WebSocketShard;
    public constructor(name: keyof WebSocketShardEvents) {
        this.name = name;
    }

    //@ts-ignore
    public handle(...args: any[]) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
