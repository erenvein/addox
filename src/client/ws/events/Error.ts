import { BaseWebSocketEvent } from '../../..';

export default class WebSocketErrorEvent extends BaseWebSocketEvent {
    public constructor() {
        super('error');
    }

    public handle(error: any) {
        this.shard.emit('error', this.shard, error);
    }
}
