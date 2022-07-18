import { BaseWebSocketEvent, GatewayOpcodes, GatewayDispatchEvents } from '../../..';

export default class WebSocketMessageEvent extends BaseWebSocketEvent {
    public constructor() {
        super('message');
    }

    public async handle(data: any) {
        const resolved = this.ws.resolve(data);

        if (!resolved) return;

        const { op, d, t, s } = resolved;

        if (s > this.ws.sequence) this.ws.sequence = s;
        if (t === 'READY') {
            this.ws.sessionId = d.session_id;
            console.log(d.user);
            this.ws.client?.rest.setToken(
                `${d.user.bot ? 'BOT' : 'Bearer'} ${this.ws.client.token!}`
            );
        }

        switch (op) {
            case GatewayOpcodes.Hello:
                this.ws.identify();
                break;
            case GatewayOpcodes.Heartbeat:
                this.ws.heartbeat(d.heartbeat_interval);
                break;
            case GatewayOpcodes.HeartbeatAck:
                this.ws.heartbeatAck();
                break;
            case GatewayDispatchEvents.Resumed:
                this.ws.socket.send({ op: GatewayOpcodes.Heartbeat, d: this.ws.sequence });
                this.ws.lastHeartbeatAck = true;
                this.ws.lastPing = Date.now();
                break;
            case GatewayOpcodes.InvalidSession:
                if (d) {
                    this.ws.identify();
                    return;
                }

                this.ws.sequence = -1;
                this.ws.sessionId = null;
                break;
            default:
                try {
                    const mod = await import(`../handlers/${t}.ts`).then((mod) => mod.default);

                    const handler = new mod();

                    handler.client = this.ws.client;

                    handler.handle(d);
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    }
}
