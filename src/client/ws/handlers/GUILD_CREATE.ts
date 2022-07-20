import { BaseWebSocketHandler, GatewayGuildCreateDispatch, RawGuildData } from '../../..';

export default class GuildCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildCreate');
    }

    public handle({ d }: GatewayGuildCreateDispatch) {
        (d as RawGuildData).shard_id = this.shard.id;

        this.shard.guilds.set(d.id, d);
    }
}
