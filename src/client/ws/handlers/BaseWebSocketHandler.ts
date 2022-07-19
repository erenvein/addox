import type { GatewayDispatchEvents, WebSocketShard } from '../../..';

export class BaseWebSocketHandler {
    public name: keyof typeof GatewayDispatchEvents;
    public shard!: WebSocketShard;
    public constructor(name: keyof typeof GatewayDispatchEvents) {
        this.name = name;
    }

    public handle(data: any) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
