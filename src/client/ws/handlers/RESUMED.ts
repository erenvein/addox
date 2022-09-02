import { BaseWebSocketHandler } from '../../../index';

export default class ResumedHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle() {
        this.shard.heartbeatAck();
        this.shard.sendHeartbeat();

        this.shard.emit('resumed', this.shard, this.shard.sequence - this.shard.closeSequence);
    }
}
