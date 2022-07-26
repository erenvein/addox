import {
    type APIGuildMember,
    type Guild,
    type Client,
    type EditGuildMemberData,
    type Snowflake,
    type RESTPutAPIGuildBanJSONBody,
    type ImageOptions,
    GuildMemberCacheManager,
    PermissionFlagsBitField,
    PermissionFlagsBitsResolver,
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
    public caches!: GuildMemberCacheManager;
    #permissions!: number | null;
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
        this.caches = new GuildMemberCacheManager(this.client, this.guild, this);

        //@ts-ignore
        this.#permissions = data.permissions ?? null;

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

    public avatarURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.avatar
            ? `https://cdn.discordapp.com/guilds/${this.guild.id}/users/${this.id}/avatars/${
                  this.avatar
              }.${dynamic && this.avatar.startsWith('a_') ? 'gif' : format ?? 'png'}?size=${
                  size ?? 1024
              }`
            : null;
    }

    public get permissions() {
        const perms = this.#permissions;

        if (perms) {
            return new PermissionFlagsBitField(perms);
        } else {
            return this.caches.roles.permissions;
        }
    }
}
