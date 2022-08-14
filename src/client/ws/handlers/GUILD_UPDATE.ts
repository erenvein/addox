import {
    BaseWebSocketHandler,
    GatewayGuildUpdateDispatch,
    type APIGuildWithShard,
    Guild,
} from '../../../index';

export default class GuildUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildUpdate');
    }

    public override handle({ d }: GatewayGuildUpdateDispatch) {
        let _guild = this.shard.guilds.get(d.id);

        (d as unknown as APIGuildWithShard).shard_id = this.shard.id;

        if (_guild) {
            const guild = _guild;

            _guild = _guild._patch(d);

            this.shard.guilds.set(guild.id, _guild);
            this.shard.manager.emit('guildUpdate', guild, _guild);
        } else {
            const guild = new Guild(this.shard.manager.client, d);

            this.shard.guilds.set(d.id, guild);
            this.shard.manager.emit('guildCreate', guild);
        }
    }
}
