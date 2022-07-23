import { BaseWebSocketHandler, GatewayGuildRoleCreateDispatch, Role } from '../../..';

export default class GuildRoleCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildRoleCreate');
    }

    public handle({ d }: GatewayGuildRoleCreateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const role = new Role(this.shard.manager.client, guild, d.role);

            guild?.caches.roles.cache.set(role.id, role);
            this.shard.manager.client.emit('roleCreate', role);
        }
    }
}
