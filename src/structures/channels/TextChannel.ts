import type { APITextChannel, Guild, Client } from '../../index';

import { BaseGuildTextChannel } from '../base/BaseGuildTextChannel';

export class TextChannel extends BaseGuildTextChannel {
    public defaultAutoArchiveDuration!: number | null;
    public lastPinTimestamp!: number | null;
    public rateLimitPerUser!: number;
    public topic!: string | null;

    public constructor(client: Client, guild: Guild, data: APITextChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APITextChannel) {
        super._patch(data);

        this.defaultAutoArchiveDuration = data.default_auto_archive_duration ?? null;
        this.lastPinTimestamp = data.last_pin_timestamp
            ? new Date(data.last_pin_timestamp).getTime()
            : null;
        this.nsfw = data.nsfw ?? false;
        this.rateLimitPerUser = data.rate_limit_per_user ?? 0;
        this.topic = data.topic ?? null;

        return this;
    }
}
