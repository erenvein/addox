import {
    Client,
    GatewayMessageReactionAddDispatchData,
    Snowflake,
    GuildEmoji,
    APIEmoji,
    GuildMember,
    APIGuildMember,
    MessageableChannelResolvable,
} from '../index';

import { BaseStructure } from './base/BaseStructure';

export class MessageReaction extends BaseStructure {
    public channelId!: Snowflake;
    public guildId!: Snowflake | null;
    public emoji!: APIEmoji | GuildEmoji;
    public member!: GuildMember | APIGuildMember | null;
    public messageId!: Snowflake;
    public userId!: Snowflake;

    public constructor(client: Client, data: GatewayMessageReactionAddDispatchData) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: GatewayMessageReactionAddDispatchData) {
        this.channelId = data.channel_id;
        this.guildId = data.guild_id ?? null;
        this.emoji = this.guild
            ? this.guild.caches.emojis.cache._add(
                  data.emoji.id!,
                  new GuildEmoji(this.client, this.guild, data.emoji)
              )
            : data.emoji;
        this.member = data.member
            ? this.guild
                ? this.guild.caches.members.cache._add(
                      data.member.user!.id,
                      new GuildMember(this.client, this.guild, data.member)
                  )
                : data.member
            : null;
        this.messageId = data.message_id;
        this.userId = data.user_id;

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }

    public get channel() {
        return this.client.caches.channels.cache.get(
            this.channelId
        ) as MessageableChannelResolvable;
    }

    public get message() {
        return this.channel!.caches.messages.cache.get(this.messageId);
    }
}
