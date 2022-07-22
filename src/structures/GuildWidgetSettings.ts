import type { Client, APIGuildWidgetSettings, Snowflake } from '../';

import { BaseStructure } from './BaseStructure';

export class GuildWidgetSettings extends BaseStructure {
    public channelId!: Snowflake | null;
    public guildId!: Snowflake;
    public enabled!: boolean;

    public constructor(client: Client, guildId: Snowflake, data: APIGuildWidgetSettings) {
        super(client);

        this.guildId = guildId;

        this._patch(data);
    }

    public _patch(data: APIGuildWidgetSettings) {
        this.channelId = data.channel_id;
        this.enabled = data.enabled;

        return this;
    }

    /* TODO
    
    public get channel() {
        return this.client.caches.channels.cache.get(this.channelId!);
    }*/

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId);
    }
}
