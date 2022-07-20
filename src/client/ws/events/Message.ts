import { BaseWebSocketEvent, GatewayOpcodes, BaseWebSocketHandler } from '../../..';

export default class WebSocketMessageEvent extends BaseWebSocketEvent {
    public constructor() {
        super('message');
    }

    public async handle(data: any) {
        const resolved = this.shard.deserialize(data);

        if (!resolved) return;

        const { op, d, t, s } = resolved;

        if (s > this.shard.sequence) this.shard.sequence = s;

        switch (op) {
            case GatewayOpcodes.Hello:
                this.shard.setHeartbeatTimer(d.heartbeat_interval);
                this.shard.identify();
                break;
            case GatewayOpcodes.Heartbeat:
                this.shard.sendHeartbeat();
                break;
            case GatewayOpcodes.HeartbeatAck:
                this.shard.heartbeatAck(true);
                break;
            case GatewayOpcodes.InvalidSession:
                if (d) {
                    this.shard.identify();
                    return;
                }

                this.shard.close(1000);
                this.shard.identify();
                break;
            case GatewayOpcodes.Reconnect:
                await this.shard.reconnect();
                break;
            case GatewayOpcodes.Dispatch:
                try {
                    this.shard.manager.client?.emit('Raw', d);

                    const mod = await import(`../handlers/${t}.ts`).then((mod) => mod.default);

                    const handler: BaseWebSocketHandler = new mod();

                    handler.shard = this.shard;

                    handler.handle({ op, d, t, s });
                } catch {}
                break;
        }
    }
}
