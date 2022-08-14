import {
    type APINewsChannel,
    type Guild,
    type Client,
    type Snowflake,
    type CategoryChannel,
    type RESTPostAPIChannelFollowersResult,
    FollowedChannel,
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
        const data = await this.client.rest.post<RESTPostAPIChannelFollowersResult>(
            `/channels/${this.id}/followers`,
            {
                body: { webhook_id: webhookId },
            }
        );

        return new FollowedChannel(this.client, data);
    }
}
