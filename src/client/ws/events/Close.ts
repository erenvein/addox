import { BaseWebSocketEvent, GatewayCloseCodes, DiscordSocketError } from '../../..';

export default class WebSocketCloseEvent extends BaseWebSocketEvent {
    public constructor() {
        super('close');
    }

    public handle(code: number, reason: Buffer) {
        const resolved = Buffer.from(reason).toString('utf-8');

        switch (code) {
            //reconnectable errors
            case GatewayCloseCodes.UnknownError:
            case GatewayCloseCodes.UnknownOpcode:
            case GatewayCloseCodes.DecodeError:
            case GatewayCloseCodes.NotAuthenticated:
            case GatewayCloseCodes.AlreadyAuthenticated:
            case GatewayCloseCodes.InvalidSeq:
            case GatewayCloseCodes.RateLimited:
            case GatewayCloseCodes.SessionTimedOut:
                this.ws.reconnect();
                break;

            //non-reconnectable errors
            case GatewayCloseCodes.InvalidShard:
            case GatewayCloseCodes.ShardingRequired:
            case GatewayCloseCodes.InvalidAPIVersion:
            case GatewayCloseCodes.InvalidIntents:
            case GatewayCloseCodes.DisallowedIntents:
            case GatewayCloseCodes.AuthenticationFailed:
                throw new DiscordSocketError(resolved);
        }
    }
}
