import { BaseWebSocketEvent } from '../../../index';

export default class WebSocketErrorEvent extends BaseWebSocketEvent {
    public constructor() {
        super('error');
    }

    public override handle(error: any) {
        this.shard.emit('error', this.shard, error);
    }
}
