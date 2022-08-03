import {
    type Client,
    type Snowflake,
    type FetchOptions,
    SnowflakeUtil,
    type APIAnyChannel,
    ChannelType,
    ChannelFlagsBitField,
    type EditChannelData,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class BaseChannel extends BaseStructure {
    public id!: Snowflake;
    public name!: string | null;
    public type!: keyof typeof ChannelType;
    public flags!: ChannelFlagsBitField;

    public constructor(client: Client, data: APIAnyChannel) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIAnyChannel) {
        this.id = data.id;
        this.name = data.name ?? null;
        this.type = ChannelType[data.type] as keyof typeof ChannelType;
        this.flags = new ChannelFlagsBitField(data.flags ?? 0);

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get url() {
        return `https://discordapp.com/channels/${this.id}`;
    }

    public async delete() {
        return await this.client.caches.channels.delete(this.id);
    }

    public async fetch(options?: FetchOptions) {
        return await this.client.caches.channels.fetch(this.id, options);
    }

    public async edit(data: EditChannelData, reason?: string) {
        return await this.client.caches.channels.edit(this.id, data, reason);
    }
}
