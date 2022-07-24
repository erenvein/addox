import {
    type APIGuildMember,
    type Guild,
    type Client,
    type EditGuildMemberData,
    type Snowflake,
    type RESTPutAPIGuildBanJSONBody,
    GuildMemberRoleManager,
} from '../index';

import { BaseStructure } from './BaseStructure';

export class GuildMember extends BaseStructure {
    public id!: Snowflake;
    public avatar!: string | null;
    public communicationDisabledUntilTimestamp!: number;
    public deaf!: boolean;
    public joinedAt!: Date;
    public mute!: boolean;
    public nick!: string | null;
    public pending!: boolean;
    public premiumSinceTimestamp!: number;
    public roles!: GuildMemberRoleManager;
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIGuildMember) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildMember) {
        this.id = data.user?.id!;
        this.avatar = data.avatar ?? null;
        this.communicationDisabledUntilTimestamp = data.communication_disabled_until
            ? new Date(data.communication_disabled_until).getTime()
            : 0;
        this.deaf = data.deaf;
        this.joinedAt = new Date(data.joined_at);
        this.mute = data.mute;
        this.nick = data.nick ?? null;
        this.pending = data.pending ?? false;
        this.premiumSinceTimestamp = data.premium_since
            ? new Date(data.premium_since).getTime()
            : 0;
        this.roles = new GuildMemberRoleManager(this.client, this.guild, this);
        return this;
    }

    public get communicationDisabledUntilAt() {
        return new Date(this.communicationDisabledUntilTimestamp);
    }

    public get joinedTimestamp() {
        return this.joinedAt.getTime();
    }

    public get user() {
        return this.client.caches.users.cache.get(this.id);
    }

    public async edit(data: EditGuildMemberData, reason?: string) {
        return await this.guild.caches.members.edit(this.id, data, reason);
    }

    public async kick(reason?: string) {
        return await this.guild.caches.members.kick(this.id, reason);
    }

    public async ban(data?: RESTPutAPIGuildBanJSONBody, reason?: string) {
        return await this.guild.caches.bans.create(this.id, data, reason);
    }

    public async unban(reason?: string) {
        return await this.guild.caches.bans.remove(this.id, reason);
    }
}
