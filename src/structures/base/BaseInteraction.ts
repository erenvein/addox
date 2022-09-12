import {
    type APIInteraction,
    type Client,
    type Snowflake,
    type LocalizationMap,
    type APIMessage,
    type APIGuildMember,
    type MessageableChannelResolvable,
    type EditWebhookMessageData,
    type CallbackInteractionOptions,
    type ReplyInteractionData,
    Message,
    PermissionFlagsBitField,
    InteractionType,
    User,
    GuildMember,
    InteractionWebhook,
    CreateWebhookMessageData,
    InteractionResponseType,
    DeferReplyOptions,
    MessageFlagsBitsResolver,
    SnowflakeUtil,
    APIModalInteractionResponseCallbackData,
    ModalBuilder,
} from '../../index';

import { BaseStructure } from './BaseStructure';

export class BaseInteraction extends BaseStructure {
    public applicationPermissions!: PermissionFlagsBitField;
    public applicationId!: Snowflake;
    public channelId!: Snowflake | null;
    public guildId!: Snowflake | null;
    public guildLocale!: LocalizationMap | null;
    public id!: Snowflake;
    public member!: GuildMember | APIGuildMember | null;
    public message!: Message | APIMessage | null;
    public token!: string;
    public type!: keyof typeof InteractionType;
    public user!: User | null;
    public version!: number;
    public webhook!: InteractionWebhook;

    public constructor(client: Client, data: APIInteraction) {
        super(client);

        data.data;

        this._patch(data);
    }

    public override _patch(data: APIInteraction) {
        this.applicationPermissions = new PermissionFlagsBitField(
            data.app_permissions ? +data.app_permissions : 0
        );
        this.applicationId = data.application_id;
        this.channelId = data.channel_id ?? null;
        this.guildId = data.guild_id ?? null;
        this.guildLocale = (data.guild_locale as LocalizationMap) ?? null;
        this.id = data.id;
        this.member =
            this.guild && data.member
                ? new GuildMember(this.client, this.guild, data.member)
                : data.member ?? null;
        this.message = data.message ?? null;
        this.token = data.token;
        this.type = InteractionType[data.type] as keyof typeof InteractionType;
        this.user = data.user
            ? this.client.caches.users.cache._add(data.user.id, new User(this.client, data.user))
            : null;
        this.version = data.version;
        this.webhook = new InteractionWebhook(this.client, {
            id: this.applicationId,
            token: this.token,
        });

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get channel() {
        return this.client.caches.channels.cache.get(this.channelId!) as
            | MessageableChannelResolvable
            | undefined;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public async fetchReply() {
        return await this.webhook.caches.messages.fetch('@original');
    }

    public async editReply(data: EditWebhookMessageData) {
        return await this.webhook.caches.messages.edit('@original', data);
    }

    public async deleteReply() {
        return await this.webhook.caches.messages.delete('@original');
    }

    public async followUp(data: CreateWebhookMessageData) {
        return await this.webhook.send(data, {
            wait: undefined,
        });
    }

    public async callback<T>(type: keyof typeof InteractionResponseType, data?: any) {
        return await this.client.rest.post<T>(`/interactions/${this.id}/${this.token}/callback`, {
            body: {
                type: InteractionResponseType[type],
                data,
            },
        });
    }

    public async reply(
        data: ReplyInteractionData,
        { fetchReply }: CallbackInteractionOptions = { fetchReply: true }
    ): Promise<Message | void> {
        if (data?.flags) {
            data.flags = MessageFlagsBitsResolver(data.flags);
        }

        await this.callback<void>('ChannelMessageWithSource', data);

        if (fetchReply) {
            return await this.fetchReply();
        }

        return undefined;
    }

    public async deferReply(
        options: DeferReplyOptions = { fetchReply: true }
    ): Promise<Message | void> {
        if (options?.flags) {
            options.flags = MessageFlagsBitsResolver(options.flags);
        }

        await this.callback<void>('DeferredChannelMessageWithSource', {
            flags: MessageFlagsBitsResolver(options?.flags),
        });

        if (options.fetchReply) {
            return await this.fetchReply();
        }

        return undefined;
    }

    public async deferUpdate(
        { fetchReply }: CallbackInteractionOptions = { fetchReply: true }
    ): Promise<Message | void> {
        await this.callback<void>('DeferredMessageUpdate');

        if (fetchReply) {
            return await this.fetchReply();
        }

        return undefined;
    }

    public async update(
        data: ReplyInteractionData,
        { fetchReply }: CallbackInteractionOptions = { fetchReply: true }
    ): Promise<Message | void> {
        if (data?.flags) {
            data.flags = MessageFlagsBitsResolver(data.flags);
        }

        await this.callback<void>('UpdateMessage', data);

        if (fetchReply) {
            return await this.fetchReply();
        }

        return undefined;
    }

    public async showModal(data: APIModalInteractionResponseCallbackData | ModalBuilder) {
        return await this.callback<void>('Modal', data);
    }
}
