import {
    type Client,
    type APIGuildForumChannel,
    type Guild,
    type Snowflake,
    type GuildForumChannelTagData,
    type GuildForumChannelDefaultReactionEmojiData,
    type FetchOptions,
    Collection,
    GuildEmoji,
    ForumChannelDefaultShortOrderTypes,
} from '../../index';

import { TextChannel } from './TextChannel';

export class ForumChannel extends TextChannel {
    public availableTags!: Collection<Snowflake, GuildForumChannelTagData>;
    public appliedTags!: Snowflake[];
    public defaultReactionEmoji!: GuildForumChannelDefaultReactionEmojiData | null;
    public defaultShortOrder!: keyof typeof ForumChannelDefaultShortOrderTypes;

    public constructor(client: Client, guild: Guild, data: APIGuildForumChannel) {
        //@ts-ignore
        super(client, guild, data);

        this._patch(data);
    }

    //@ts-ignore
    public override _patch(data: APIGuildForumChannel) {
        //@ts-ignore
        super._patch(data);

        //@ts-ignore
        this.availableTags = new Collection(
            //@ts-ignore
            data.available_tags
                ? //@ts-ignore
                  data.available_tags.map((tag) => [
                      tag.id,
                      {
                          id: tag.id,
                          name: tag.name,
                          moderated: tag.moderated,
                          emojiId: tag.emoji_id,
                          emojiName: tag.emoji_name ?? null,
                      },
                  ])
                : []
        );
        //@ts-ignore
        this.appliedTags = data.applied_tags ?? [];
        //@ts-ignore
        this.defaultReactionEmoji = data.default_reaction_emoji
            ? {
                  //@ts-ignore
                  emojiId: data.default_reaction_emoji.emoji_id,
                  //@ts-ignore
                  emoji_name: data.default_reaction_emoji.emoji_name ?? null,
              }
            : null;

        this.defaultShortOrder = ForumChannelDefaultShortOrderTypes[
            //@ts-ignore
            data.default_short_order ?? 'LatestActivity'
        ] as keyof typeof ForumChannelDefaultShortOrderTypes;

        return this;
    }

    public async fetchDefaultReactionEmoji(options?: FetchOptions) {
        const emoji = (await this.guild.caches.emojis.fetch(
            this.defaultReactionEmoji!.emojiId,
            options
        )) as GuildEmoji;

        this.defaultReactionEmoji = {
            emojiId: emoji.id,
            emojiName: emoji.name,
        };

        return emoji;
    }
}
