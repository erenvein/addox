import { BaseWebSocketHandler, GatewayGuildRoleDeleteDispatch, Role } from '../../..';

export default class GuildRoleDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildRoleDelete');
    }

    public handle({ d }: GatewayGuildRoleDeleteDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const role = guild.caches.roles.cache.get(d.role_id);

            if (role) {
                guild?.caches.roles.cache.delete(role.id);
                this.shard.manager.client.emit('roleDelete', role);
            }
        }
    }
}
