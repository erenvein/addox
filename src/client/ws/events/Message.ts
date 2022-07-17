import { BaseWebSocketEvent, GatewayOpcodes } from '../../..';

export default class WebSocketMessageEvent extends BaseWebSocketEvent {
    public constructor() {
        super('message');
    }

    public handle(data: any) {
        const resolved = this.ws.resolve(data);

        if (!resolved) return;

        const { op, d, t, s } = resolved;

        if (s > this.ws.sequence) this.ws.sequence = s;
        if (t === 'READY') this.ws.sessionId = d.session_id;

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
        }
    }
}
