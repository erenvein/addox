import { BaseWebSocketEvent, GatewayCloseCodes, DiscordSocketError } from '../../..';

export default class WebSocketCloseEvent extends BaseWebSocketEvent {
    public constructor() {
        super('close');
    }

    public handle(code: number, reason: Buffer) {
        const resolved = Buffer.from(reason).toString('utf-8');

        this.shard.closeSequence = this.shard.sequence;

        this.shard.emit('Close', this.shard, code, resolved);

        switch (code) {
            // by owner
            case 1000:
                this.shard.emit('Disconnect', this.shard, 1000, 'Performed By Owner');
                break;

            //reconnectable errors
            case GatewayCloseCodes.UnknownError:
            case GatewayCloseCodes.UnknownOpcode:
            case GatewayCloseCodes.DecodeError:
            case GatewayCloseCodes.NotAuthenticated:
            case GatewayCloseCodes.AlreadyAuthenticated:
            case GatewayCloseCodes.InvalidSeq:
            case GatewayCloseCodes.RateLimited:
            case GatewayCloseCodes.SessionTimedOut:
                this.shard.reconnect();
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
