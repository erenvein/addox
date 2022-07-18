import { BaseWebSocketEvent, GatewayCloseCodes, DiscordSocketError } from '../../..';

export default class WebSocketCloseEvent extends BaseWebSocketEvent {
    public constructor() {
        super('close');
    }

    public handle(code: number, reason: Buffer) {
        const resolved = Buffer.from(reason).toString('utf-8');

        switch (code) {
            case GatewayCloseCodes.UnknownError:
                this.ws.reconnect();
                break;
            case GatewayCloseCodes.UnknownOpcode:
                this.ws.reconnect();
                break;
            case GatewayCloseCodes.DecodeError:
                this.ws.reconnect();
                break;
            case GatewayCloseCodes.NotAuthenticated:
                this.ws.reconnect();
                break;
            case GatewayCloseCodes.AuthenticationFailed:
                throw new DiscordSocketError(resolved);
                break;
            case GatewayCloseCodes.AlreadyAuthenticated:
                this.ws.reconnect();
                break;
            case GatewayCloseCodes.InvalidSeq:
                this.ws.reconnect();
                break;
            case GatewayCloseCodes.RateLimited:
                this.ws.reconnect();
                break;
            case GatewayCloseCodes.SessionTimedOut:
                this.ws.reconnect();
                break;
            case GatewayCloseCodes.InvalidShard:
                throw new DiscordSocketError(resolved);
                break;
            case GatewayCloseCodes.ShardingRequired:
                throw new DiscordSocketError(resolved);
                break;
            case GatewayCloseCodes.InvalidAPIVersion:
                throw new DiscordSocketError(resolved);
                break;
            case GatewayCloseCodes.InvalidIntents:
                throw new DiscordSocketError(resolved);
                break;
            case GatewayCloseCodes.DisallowedIntents:
                throw new DiscordSocketError(resolved);
                break;
        }
    }
}
