import {
    type Snowflake,
    User,
    type Client,
    type APIEmoji,
    SnowflakeUtil,
    type Guild,
    type FetchOptions,
    type RESTPatchAPIGuildEmojiJSONBody,
} from '../';

import { BaseStructure } from './BaseStructure';

export class GuildEmoji extends BaseStructure {
    public id!: Snowflake | null;
    public name!: string | null;
    public roles!: Snowflake[] | null;
    public author!: User | null;
    public requireColons!: boolean;
    public managed!: boolean;
    public animated!: boolean;
    public available!: boolean;
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIEmoji) {
        super(client);

        this.guild = guild;
        this._patch(data);
    }

    public _patch(data: APIEmoji) {
        this.id = data.id;
        this.name = data.name;
        this.roles = data.roles ?? [];
        this.author = data.user ? new User(this.client, data.user) : null;
        this.requireColons = data.require_colons ?? false;
        this.managed = data.managed ?? false;
        this.animated = data.animated ?? false;
        this.available = data.available ?? true;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id!);
    }

    public get url() {
        return `https://cdn.discordapp.com/emojis/${this.id}.${this.animated ? 'gif' : 'png'}`;
    }

    public async fetch(options?: FetchOptions) {
        return await this.guild.caches.emojis.fetch(this.id!, options);
    }

    public async delete() {
        return await this.guild.caches.emojis.delete(this.id!);
    }

    public async edit(data: RESTPatchAPIGuildEmojiJSONBody) {
        return await this.guild.caches.emojis.edit(this.id!, data);
    }

    public toString() {
        return `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>`;
    }
}
