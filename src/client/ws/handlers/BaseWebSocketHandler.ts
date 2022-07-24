import type { GatewayDispatchEvents, WebSocketShard, GatewayDispatchPayload } from '../../../index';

export class BaseWebSocketHandler {
    public name: keyof typeof GatewayDispatchEvents;
    public shard!: WebSocketShard;
    public constructor(name: keyof typeof GatewayDispatchEvents) {
        this.name = name;
    }

    //@ts-ignore
    public handle(packet: GatewayDispatchPayload) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
