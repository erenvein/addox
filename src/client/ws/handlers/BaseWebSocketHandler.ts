import type { GatewayDispatchEvents, WebSocketShard, GatewayDispatchPayload } from '../../..';

export class BaseWebSocketHandler {
    public name: keyof typeof GatewayDispatchEvents;
    public shard!: WebSocketShard;
    public constructor(name: keyof typeof GatewayDispatchEvents) {
        this.name = name;
    }

    public handle(packet: GatewayDispatchPayload) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
