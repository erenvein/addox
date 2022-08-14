import {
    type GatewayGuildCreateDispatch,
    type APIGuildWithShard,
    type APIUnavailableGuild,
    Guild,
    UnavailableGuild,
    BaseWebSocketHandler,
} from '../../../index';

export default class GuildCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildCreate');
    }

    public override handle({ d }: GatewayGuildCreateDispatch) {
        if (d.unavailable) {
            this.shard.manager.client.caches.guilds.unavailables.set(
                d.id,
                new UnavailableGuild(this.shard.manager.client, d as APIUnavailableGuild)
            );
        } else {
            (d as unknown as APIGuildWithShard).shard_id = this.shard.id;

            const guild = new Guild(this.shard.manager.client, d);

            this.shard.guilds.set(d.id, guild);
            this.shard.manager.emit('guildCreate', guild);
        }
    }
}
