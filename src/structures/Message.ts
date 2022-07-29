import {
    type APIMessage,
    type Client,
    type Snowflake,
    type AnyComponent,
    type APIAnyComponent,
    type GatewayMessageCreateDispatchData,
    type APIGuildMember,
    MessageActivity,
    MessageActivityType,
    User,
    Attachment,
    ComponentType,
    ActionRowBuilder,
    ButtonBuilder,
    SelectMenuBuilder,
    TextInputBuilder,
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
} from '../index';

import { BaseStructure } from './BaseStructure';

export class Message extends BaseStructure {
    public guildId!: Snowflake | null;
    public activity!: MessageActivity | null;
    public application!: any;
    public applicationId!: Snowflake | null;
    public attachments!: Attachment[];
    public author!: User;
    public channelId!: Snowflake;
    public components!: AnyComponent[];
    public content!: string;
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
    public createdTimestamp!: number;
    public tts!: boolean;
    public type!: keyof typeof MessageType;
    public webhookId!: Snowflake | null;
    public member!: GuildMember | null;

    public constructor(client: Client, data: APIMessage | GatewayMessageCreateDispatchData) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIMessage | GatewayMessageCreateDispatchData) {
        this.activity = data.activity
            ? {
                  type: MessageActivityType[data.type] as keyof typeof MessageActivityType,
                  partyId: data.activity.party_id ?? null,
              }
            : null;
        this.application = data.application;
        this.applicationId = data.application_id ?? null;
        this.attachments = data.attachments.map((attachment) => new Attachment(attachment));
        this.author = this.client.caches.users.cache._add(
            data.author.id,
            new User(this.client, data.author)
        );
        this.channelId = data.channel_id;
        // @ts-ignore
        this.components = data.components
            ? (data.components as unknown as APIAnyComponent[]).map((component) => {
                  switch (component.type) {
                      // @ts-ignore
                      case ComponentType.ActionRow:
                          return new ActionRowBuilder(component);
                          break;
                      case ComponentType.Button:
                          return new ButtonBuilder(component);
                          break;
                      case ComponentType.SelectMenu:
                          return new SelectMenuBuilder(component);
                          break;
                      case ComponentType.TextInput:
                          return new TextInputBuilder(component);
                  }
              })
            : [];
        this.content = data.content;
        this.editedTimestamp = data.edited_timestamp
            ? new Date(data.edited_timestamp).getTime()
            : null;
        this.embeds = data.embeds.map((embed) => new EmbedBuilder(embed));
        this.flags = new MessageFlagsBitField(data.flags);
        this.id = data.id;
        this.interaction = data.interaction
            ? new MessageInteraction(this.client, data.interaction)
            : null;
        this.mentions = new MessageMentionManager(
            this.client,
            data.mentions,
            data.mention_roles,
            data.mention_channels ?? [],
            data.mention_everyone,
            this.guild ?? null
        );
        this.messageReference = data.message_reference?.message_id
            ? new MessageReference(this.client, data.message_reference)
            : null;
        this.nonce = data.nonce ?? null;
        this.pinned = data.pinned;
        this.rawPosition = data.position ?? null;
        this.caches = new MessageCacheManager(this, data.reactions ?? [], this.client);
        this.stickers = [];
        this.threadId = data.thread?.id ?? null;
        this.createdTimestamp = new Date(data.timestamp).getTime();
        this.tts = data.tts;
        this.type = MessageType[data.type] as keyof typeof MessageType;
        this.webhookId = data.webhook_id ?? null;

        if (data.sticker_items) {
            for (const sticker of data.sticker_items) {
                const _sticker = this.client.caches.stickers.cache.get(sticker.id);

                if (_sticker) {
                    this.stickers.push(_sticker);
                }
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
        return this.channel ? this.channel.caches.messages.cache.keyArray().indexOf(this.id) : null;
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
        // TODO
    }

    public async fetchWebhook() {
        // TODO
    }

    public async delete() {
        // TODO
    }

    public async edit() {
        // TODO
    }

    public async reply() {
        // TODO
    }

    public async pin() {
        // TODO
    }

    public async unpin() {
        // TODO
    }
}
