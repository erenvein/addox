import {
    type Client,
    type Snowflake,
    type ImageOptions,
    type Guild,
    type APIGuild,
    type FetchGuildOptions,
    GuildFeature,
    SnowflakeUtil,
} from '../index';

import { BaseStructure } from './BaseStructure';

export class BaseGuild extends BaseStructure {
    public id!: Snowflake;
    public name!: string;
    public icon!: string | null;
    public features!: (keyof typeof GuildFeature)[];

    public constructor(client: Client, data: APIGuild) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIGuild) {
        this.id = data.id;
        this.name = data.name;
        this.features = data.features.map((feature) => (GuildFeature as any)[feature]);
        this.icon = data.icon ?? null;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get url() {
        return `https://discordapp.com/guilds/${this.id}`;
    }

    public iconURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.icon
            ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${
                  dynamic && this.icon.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public async fetch(options?: FetchGuildOptions): Promise<Guild> {
        return (await this.client.caches.guilds.fetch(this.id, options)) as unknown as Guild;
    }
}
