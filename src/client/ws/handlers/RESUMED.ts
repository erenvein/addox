import { BaseWebSocketHandler, GatewayOpcodes } from '../../../';

export default class ResumedHandler extends BaseWebSocketHandler {
    public constructor() {
        super('Resumed');
    }

    public handle(data: any) {
        this.shard.send({
            op: GatewayOpcodes.Heartbeat,
            d: this.shard.sequence,
        });
        this.shard.heartbeatAck();
    }
}
