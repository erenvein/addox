import {
    type Snowflake,
    type Client,
    type APIRole,
    SnowflakeUtil,
    type Guild,
    type FetchOptions,
    type RoleData,
    type RoleTags,
    HexDecimalToHex,
    PermissionFlagsBitField,
} from '../index';

import { BaseStructure } from './BaseStructure';

export class Role extends BaseStructure {
    public id!: Snowflake;
    public name!: string;
    public color!: number;
    public hoist!: boolean;
    public icon!: string | null;
    public unicodeEmoji!: string | null;
    public rawPosition!: number;
    public permissions!: PermissionFlagsBitField;
    public managed!: boolean;
    public mentionable!: boolean;
    public tags!: RoleTags;
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIRole) {
        super(client);

        this.guild = guild;
        this._patch(data);
    }

    public override _patch(data: APIRole) {
        this.id = data.id;
        this.name = data.name;
        this.color = data.color;
        this.hoist = data.hoist;
        this.icon = data.icon ?? null;
        this.unicodeEmoji = data.unicode_emoji ?? null;
        this.rawPosition = data.position;
        this.permissions = new PermissionFlagsBitField(+data.permissions);
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        this.tags = data.tags
            ? {
                  botId: data.tags.bot_id ?? null,
                  integrationId: data.tags.integration_id ?? null,
                  premiumSubscriber: data.tags.premium_subscriber ?? null,
              }
            : {};

        return this;
    }

    public permissionsIn(channelId: Snowflake) {
        // TODO
    }

    public permissionsFor(memberId: Snowflake) {
        // TODO
    }

    public get hexColor() {
        return HexDecimalToHex(this.color);
    }

    public get position() {
        return this.guild.caches.roles.cache.keyArray().indexOf(this.id);
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id!);
    }

    public async fetch(options?: FetchOptions): Promise<Role> {
        return (await this.guild.caches.roles.fetch(this.id, options)) as unknown as Role;
    }

    public async delete(reason?: string) {
        return await this.guild.caches.roles.delete(this.id, reason);
    }

    public async edit(data: RoleData, reason?: string) {
        return await this.guild.caches.roles.edit(this.id, data, reason);
    }

    public async setPosition(position: number, reason?: string) {
        return await this.guild.caches.roles.setPosition(this.id, position, reason);
    }
}
