import {
    type Client,
    type Snowflake,
    type Guild,
    type Role,
    type GuildMember,
    PermissionFlagsBitField,
    UserFlags,
} from '../../index';

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

    public get permissions() {
        return new PermissionFlagsBitField(
            //@ts-ignore
            this.cache.reduce((accumulator, role) => accumulator | role.permissions.bitset, 0)
        );
    }

    public async set(roles: Snowflake[], reason?: string) {
        this.cache.clear();

        for (const id of roles) {
            const _role = this.guild.caches.roles.cache.get(id);

            if (_role) {
                this.cache.set(id, _role);
            }
        }

        return await this.member.edit({ roles }, reason);
    }

    public async add(id: Snowflake, reason?: string) {
        const role = this.guild.caches.roles.cache.get(id);

        if (role) {
            this.cache.set(id, role);
        }

        return await this.guild.caches.members.addRole(this.member.id, id, reason);
    }

    public async remove(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return await this.guild.caches.members.removeRole(this.member.id, id, reason);
    }
}
