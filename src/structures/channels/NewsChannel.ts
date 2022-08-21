import type {
    APINewsChannel,
    Guild,
    Client,
    Snowflake,
    EditChannelData,
    FetchOptions,
} from '../../index';

import { BaseGuildTextChannel } from '../base/BaseGuildTextChannel';

export class NewsChannel extends BaseGuildTextChannel {
    public defaultAutoArchiveDuration!: number | null;
    public lastPinTimestamp!: number | null;
    public topic!: string | null;

    public constructor(client: Client, guild: Guild, data: APINewsChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APINewsChannel) {
        super._patch(data);

        this.defaultAutoArchiveDuration = data.default_auto_archive_duration ?? null;
        this.lastPinTimestamp = data.last_pin_timestamp
            ? new Date(data.last_pin_timestamp).getTime()
            : null;
        this.topic = data.topic ?? null;

        return this;
    }

    public get lastPinAt() {
        return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : null;
    }

    public async follow(webhookId: Snowflake) {
        return await this.guild.caches.channels.followNewsChannel(this.id, webhookId);
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as NewsChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as NewsChannel;
    }
}
