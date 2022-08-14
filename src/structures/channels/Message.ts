import {
    type APIMessage,
    type Client,
    type Snowflake,
    type GatewayMessageCreateDispatchData,
    type APIGuildMember,
    MessageActivity,
    MessageActivityType,
    User,
    Attachment,
    ActionRowBuilder,
    EmbedBuilder,
    MessageFlagsBitField,
    MessageInteraction,
    MessageMentionManager,
    Sticker,
    MessageCacheManager,
    MessageType,
    GuildMember,
    type TextBasedChannelResolvable,
    MessageReference,
    type EditMessageData,
    type ReplyMessageOptions,
    type GatewayMessageUpdateDispatchData,
    SnowflakeUtil,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class Message extends BaseStructure {
    public guildId!: Snowflake | null;
    public activity!: MessageActivity | null;
    public application!: any;
    public applicationId!: Snowflake | null;
    public attachments!: Attachment[];
    public author!: User;
    public channelId!: Snowflake;
    public components!: ActionRowBuilder[];
    public content!: string | null;
    public editedTimestamp!: number | null;
    public embeds!: EmbedBuilder[];
    public flags!: MessageFlagsBitField;
    public id!: Snowflake;
    public interaction!: MessageInteraction | null;
    public mentions!: MessageMentionManager;
    public messageReference!: MessageReference | null;
    public nonce!: string | number | null;
    public pinned!: boolean;
    public rawPosition!: number | null;
    public caches!: MessageCacheManager;
    public stickers!: Sticker[];
    public threadId!: Snowflake | null;
    public tts!: boolean;
    public type!: keyof typeof MessageType;
    public webhookId!: Snowflake | null;
    public member!: GuildMember | null;

    public constructor(
        client: Client,
        data: APIMessage | GatewayMessageCreateDispatchData | GatewayMessageUpdateDispatchData
    ) {
        super(client);

        this._patch(data);
    }

    public override _patch(
        data: APIMessage | GatewayMessageCreateDispatchData | GatewayMessageUpdateDispatchData
    ) {
        this.activity = data.activity
            ? {
                  type: MessageActivityType[data.type!] as keyof typeof MessageActivityType,
                  partyId: data.activity.party_id ?? null,
              }
            : null;
        this.application = data.application;
        this.applicationId = data.application_id ?? null;
        this.attachments = data.attachments
            ? data.attachments.map((attachment) => new Attachment(attachment))
            : [];
        this.author = this.client.caches.users.cache._add(
            // @ts-ignore
            data.author.id,
            // @ts-ignore
            new User(this.client, data.author)
        );
        this.channelId = data.channel_id;
        this.content = data.content ?? null;
        this.editedTimestamp = data.edited_timestamp
            ? new Date(data.edited_timestamp).getTime()
            : null;
        this.embeds = data.embeds ? data.embeds.map((embed) => new EmbedBuilder(embed)) : [];
        this.flags = new MessageFlagsBitField(data.flags);
        this.id = data.id;
        this.interaction = data.interaction
            ? new MessageInteraction(this.client, data.interaction)
            : null;
        this.mentions = new MessageMentionManager(
            this.client,
            data.mentions,
            data.mention_roles ?? [],
            data.mention_channels ?? [],
            data.mention_everyone ?? false,
            this.guild ?? null
        );
        this.messageReference = data.message_reference?.message_id
            ? new MessageReference(this.client, data.message_reference)
            : null;
        this.nonce = data.nonce ?? null;
        this.pinned = data.pinned ?? false;
        this.rawPosition = data.position ?? null;
        this.caches ??= new MessageCacheManager(this, data.reactions ?? [], this.client);
        this.threadId = data.thread?.id ?? null;
        this.components = data.components
            ? data.components.map(({ components }) => new ActionRowBuilder(components))
            : [];
        this.tts = data.tts ?? false;
        this.type = MessageType[data.type!] as keyof typeof MessageType;
        this.webhookId = data.webhook_id ?? null;
        this.stickers = [];

        for (const sticker of data.sticker_items ?? []) {
            const _sticker = this.client.caches.stickers.cache.get(sticker.id);

            if (_sticker) {
                this.stickers.push(_sticker);
            }
        }

        if ('guild_id' in data) {
            this.guildId = data.guild_id ?? null;
        } else {
            this.guildId ??= null;
        }

        if ('member' in data) {
            if (this.guild) {
                this.member = this.guild.caches.members.cache._add(
                    this.author.id,
                    new GuildMember(this.client, this.guild, data.member as APIGuildMember)
                );
            } else {
                this.member ??= null;
            }
        } else {
            this.member ??= null;
        }
        

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get thread() {
        return this.guild ? this.guild.caches.channels.cache.get(this.threadId!) : undefined;
    }

    public get editedAt() {
        return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get channel(): TextBasedChannelResolvable | undefined {
        return (
            this.guild
                ? this.guild.caches.channels.cache.get(this.channelId)!
                : this.client.caches.channels.cache.get(this.channelId)!
        ) as TextBasedChannelResolvable;
    }

    public get position() {
        // @ts-ignore
        return this.channel
            ? this.channel.caches?.messages.cache.keyArray().indexOf(this.id)
            : null;
    }

    public get url() {
        return `https://discordapp.com/channels/${this.guildId ?? '@me'}/${this.channelId}/${
            this.id
        }`;
    }

    public inGuild() {
        return !!this.guildId;
    }

    public async fetch() {
        return this.channel?.caches.messages.fetch(this.id) as Promise<Message>;
    }

    public async delete(reason?: string) {
        return this.channel?.caches.messages.delete(this.id, reason);
    }

    public async edit(data: EditMessageData) {
        return this.channel?.caches.messages.edit(this.id, data);
    }

    public async reply(data: ReplyMessageOptions, failIfNotExists?: boolean) {
        return await this.channel?.caches.messages.create({
            ...data,
            message_reference: {
                channel_id: this.channelId,
                guild_id: this.guildId!,
                message_id: this.id,
                fail_if_not_exists: failIfNotExists,
            },
        });
    }

    public async pin(reason?: string) {
        return this.channel?.caches.pins.create(this.id, reason);
    }

    public async unpin(reason?: string) {
        return this.channel?.caches.pins.delete(this.id, reason);
    }

    public async fetchWebhook() {
        // TODO
    }
}
