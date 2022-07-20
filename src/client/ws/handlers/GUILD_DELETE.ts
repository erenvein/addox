import { BaseWebSocketHandler, GatewayGuildDeleteDispatch } from '../../..';

export default class GuildDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildDelete');
    }

    public handle({ d }: GatewayGuildDeleteDispatch) {
        this.shard.guilds.delete(d.id);
    }
}
