import type { Client, APIGuildWelcomeScreenChannel, Snowflake } from '../';

import { BaseStructure } from './BaseStructure';

export class GuildWelcomeScreenChannel extends BaseStructure {
    public id!: Snowflake;
    public description!: string;
    public emojiId!: Snowflake | null;
    public emojiName!: string | null;
    public guildId!: Snowflake;

    public constructor(client: Client, guildId: Snowflake, data: APIGuildWelcomeScreenChannel) {
        super(client);

        this.guildId = guildId;

        this._patch(data);
    }

    public _patch(data: APIGuildWelcomeScreenChannel) {
        this.id = data.channel_id;
        this.description = data.description;
        this.emojiId = data.emoji_id;
        this.emojiName = data.emoji_name;

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId)!;
    }

    public get emoji() {
        return this.client.caches.emojis.cache.get(this.emojiId!);
    }
}
