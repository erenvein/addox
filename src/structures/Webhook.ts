import {
    APIWebhook,
    Client,
    WebhookType,
    User,
    Snowflake,
    SnowflakeUtil,
    ImageOptions,
} from '../index';

import { BaseStructure } from './base/BaseStructure';

export class Webhook extends BaseStructure {
    public applicationId!: string | null;
    public avatar!: string | null;
    public channelId!: Snowflake;
    public guildId!: Snowflake | null;
    public type!: keyof typeof WebhookType;
    public id!: Snowflake;
    public name!: string | null;
    public sourceChannelId!: Snowflake | null;
    public sourceGuildId!: Snowflake | null;
    public token!: string | null;
    public oauth2URL!: string | null;
    public user!: User | null;

    public constructor(client: Client, data: APIWebhook) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIWebhook) {
        this.applicationId = data.application_id;
        this.avatar = data.avatar;
        this.channelId = data.channel_id;
        this.guildId = data.guild_id ?? null;
        this.id = data.id;
        this.name = data.name;
        this.sourceChannelId = data.source_channel ? data.source_channel.id : null;
        this.sourceGuildId = data.source_guild ? data.source_guild.id : null;
        this.token = data.token ?? null;
        this.type = WebhookType[data.type] as keyof typeof WebhookType;
        this.oauth2URL = data.url ?? null;
        this.user = data.user
            ? this.client.caches.users.cache._add(data.user.id, new User(this.client, data.user))
            : null;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get url() {
        let baseURL = `${this.client.rest.baseURL}/webhooks/${this.id}`;

        if (this.token) {
            baseURL += `/${this.token}`;
        }

        return baseURL;
    }

    public get channel() {
        return this.client.caches.channels.cache.get(this.channelId);
    }

    public get sourceChannel() {
        return this.client.caches.channels.cache.get(this.sourceChannelId!);
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get sourceGuild() {
        return this.client.caches.guilds.cache.get(this.sourceGuildId!);
    }

    public avatarURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.avatar
            ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${
                  dynamic && this.avatar.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public async fetch() {
        // TODO
    }

    public async edit() {
        // TODO
    }

    public async delete() {
        // TODO
    }
}
