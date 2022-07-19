import { BaseWebSocketEvent } from '../../..';

export default class WebSocketErrorEvent extends BaseWebSocketEvent {
    public constructor() {
        super('error');
    }

    public handle(error: any) {
        this.shard.emit('Error', this.shard, error);
    }
}
