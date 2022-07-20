import { BaseWebSocketHandler } from '../../../';

export default class ResumedHandler extends BaseWebSocketHandler {
    public constructor() {
        super('Resumed');
    }

    public handle() {
        this.shard.heartbeatAck();
        this.shard.sendHeartbeat();
        this.shard.emit('Resumed', this.shard, this.shard.sequence - this.shard.closeSequence);
    }
}
