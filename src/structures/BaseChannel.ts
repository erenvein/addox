import {
    type Client,
    type Snowflake,
    type Guild,
    type FetchOptions,
    type APIPartialChannel,
    SnowflakeUtil,
} from '../';

import { BaseStructure } from './BaseStructure';

export class BaseChannel extends BaseStructure {
    public id!: Snowflake;
    public name!: string | null;
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIPartialChannel) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public _patch(data: APIPartialChannel) {
        this.id = data.id;
        this.name = data.name ?? null;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get url() {
        return `https://discordapp.com/guilds/${this.guild.id}/channels/${this.id}`;
    }

    /* TODO
    
    public get position() {
        return this.guild.caches.channels.keyArray().indexOf(this.id);
    }

    public async fetch(options?: FetchOptions) {
        return await this.guild.caches.channels.fetch(this.id, options);
    }*/
}
