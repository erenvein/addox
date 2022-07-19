import { BaseWebSocketHandler, ClientUser } from '../../../';

export default class ReadyHandler extends BaseWebSocketHandler {
    public constructor() {
        super('Ready');
    }

    public handle(data: any) {
        this.shard.readyTimestamp = Date.now();
        this.shard.sessionId = data.session_id;

        this.shard.manager.client.user = new ClientUser(this.shard.manager.client, data.user);

        this.shard.emit('Ready', this.shard);
    }
}
