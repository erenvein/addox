import {
    BaseWebSocketHandler,
    GatewayGuildCreateDispatch,
    type APIGuildWithShard,
    Guild,
} from '../../..';

export default class GuildCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildCreate');
    }

    public handle({ d }: GatewayGuildCreateDispatch) {
        (d as unknown as APIGuildWithShard).shard_id = this.shard.id;

        const guild = new Guild(this.shard.manager.client, d);

        this.shard.guilds.set(d.id, guild);

        if (this.shard.status === 'READY') {
            this.shard.manager.client.emit('guildCreate', guild);
        }
    }
}
