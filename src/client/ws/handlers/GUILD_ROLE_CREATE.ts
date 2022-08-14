import { BaseWebSocketHandler, GatewayGuildRoleCreateDispatch, Role } from '../../../index';

export default class GuildRoleCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildRoleCreate');
    }

    public override handle({ d }: GatewayGuildRoleCreateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const role = new Role(this.shard.manager.client, guild, d.role);

            guild?.caches.roles.cache.set(role.id, role);
            this.shard.manager.emit('roleCreate', role);
        }
    }
}
