import { BaseWebSocketHandler, GatewayGuildRoleDeleteDispatch } from '../../../index';

export default class GuildRoleDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildRoleDelete');
    }

    public override handle({ d }: GatewayGuildRoleDeleteDispatch) {
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
