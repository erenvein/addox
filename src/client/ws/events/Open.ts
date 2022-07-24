import { BaseWebSocketEvent } from '../../../index';

export default class WebSocketOpenEvent extends BaseWebSocketEvent {
    public constructor() {
        super('open');
    }

    public override handle() {
        this.shard.socket!.ping();
    }
}
