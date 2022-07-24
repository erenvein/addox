import type { Client, Snowflake, Guild, Role, GuildMember } from '../../';

import { CachedManager } from '../CachedManager';

export class GuildMemberRoleManager extends CachedManager<Snowflake, Role> {
    public guild: Guild;
    public member: GuildMember;
    public constructor(client: Client, guild: Guild, member: GuildMember) {
        super(client);

        this.guild = guild;
        this.member = member;
    }

    public get highest() {
        return this.cache.sort((a, b) => b.position - a.position).first() as Role;
    }

    public async set(roles: Snowflake[], reason?: string) {
        return await this.member.edit({ roles }, reason);
    }

    public async add(id: Snowflake, reason?: string) {
        return await this.guild.caches.members.addRole(this.member.id, id, reason);
    }

    public async remove(id: Snowflake, reason?: string) {
        return await this.guild.caches.members.removeRole(this.member.id, id, reason);
    }
}
