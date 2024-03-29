import {
    type Client,
    type Snowflake,
    type APIInteractionDataResolvedChannel,
    type Guild,
    type FetchOptions,
    type EditChannelData,
    SnowflakeUtil,
    ChannelType,
    PermissionFlagsBitField,
    ThreadMetadata,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class InteractionDataResolvedChannel extends BaseStructure {
    public id!: Snowflake;
    public name!: string | null;
    public permissions!: PermissionFlagsBitField;
    public parentId!: Snowflake | null;
    public threadMetadata!: ThreadMetadata | null;
    public type!: keyof typeof ChannelType;
    public guild: Guild;

    public constructor(client: Client, data: APIInteractionDataResolvedChannel, guild?: Guild) {
        super(client);

        this.guild = guild || null;

        this._patch(data);
    }

    public override _patch(data: APIInteractionDataResolvedChannel) {
        this.id = data.id;
        this.name = data.name ?? null;
        this.permissions = new PermissionFlagsBitField(+data.permissions);
        this.parentId = data.parent_id ?? null;
        this.threadMetadata = data.thread_metadata
            ? new ThreadMetadata(this.client, data.thread_metadata)
            : null;
        this.type = ChannelType[data.type] as keyof typeof ChannelType;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get url() {
        return this.guild
            ? `https://discordapp.com/channels/${this.guild.id}/${this.id}`
            : `https://discordapp.com/channels/@me/${this.id}`;
    }

    public async fetch(options?: FetchOptions) {
        return await this.guild.caches.channels.fetch(this.id, options);
    }

    public async delete(reason?: string) {
        return await this.guild.caches.channels.delete(this.id, reason);
    }

    public async edit(data: EditChannelData, reason?: string) {
        return await this.guild.caches.channels.edit(this.id, data, reason);
    }
}
