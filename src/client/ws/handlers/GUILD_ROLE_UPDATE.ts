import { BaseWebSocketHandler, GatewayGuildRoleUpdateDispatch, Role } from '../../../index';

export default class GuildRoleUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildRoleUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            let _role = guild.caches.roles.cache.get(d.role.id);

            if (_role) {
                const role = _role;

                _role = _role._patch(d.role);

                guild.caches.roles.cache.set(role.id, _role);
                this.shard.manager.emit('roleUpdate', role, _role);
            } else {
                const role = new Role(this.shard.manager.client, guild, d.role);

                guild.caches.roles.cache.set(role.id, role);
                this.shard.manager.emit('roleCreate', role);
            }
        }
    }
}
