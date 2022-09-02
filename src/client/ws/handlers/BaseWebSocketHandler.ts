import type { GatewayDispatchEvents, WebSocketShard, GatewayDispatchPayload } from '../../../index';

export class BaseWebSocketHandler {
    public shard!: WebSocketShard;

    public handle(packet: GatewayDispatchPayload) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
