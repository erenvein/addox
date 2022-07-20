import { BaseWebSocketHandler, ClientUser, GatewayReadyDispatch } from '../../../';

export default class ReadyHandler extends BaseWebSocketHandler {
    public constructor() {
        super('Ready');
    }

    public handle({ d }: GatewayReadyDispatch) {
        this.shard.uptime = Date.now();
        this.shard.sessionId = d.session_id;
        this.shard.status = 'READY';

        this.shard.manager.client.user = new ClientUser(this.shard.manager.client, d.user);

        this.shard.heartbeatAck();
        this.shard.sendHeartbeat();
        this.shard.emit('Ready', this.shard);
    }
}
