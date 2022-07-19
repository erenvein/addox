import { BaseWebSocketEvent } from '../../..';

export default class WebSocketOpenEvent extends BaseWebSocketEvent {
    public constructor() {
        super('open');
    }

    public handle() {
        this.shard.socket.ping();
    }
}
