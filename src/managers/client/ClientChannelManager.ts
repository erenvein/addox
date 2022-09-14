import {
    type Snowflake,
    type Client,
    type APIChannel,
    type EditChannelData,
    type APIMessage,
    type AnyChannel,
    type EditMessageData,
    type CreateMessageData,
    type CollectionLike,
    ChannelType,
    type FetchOptions,
    ChannelDataResolver,
    DataResolver,
    MessageFlagsBitsResolver,
    MessageFlagsBitField,
    deleteProperty,
    Collection,
    ColorResolver,
    Message,
    type TextBasedChannelResolvable,
    GroupDMChannel,
    TextChannel,
    VoiceChannel,
    DMChannel,
    Guild,
    CategoryChannel,
    StageChannel,
    ThreadChannel,
    AnnouncementChannel,
    TextBasedChannelCacheManager,
    ForumChannel,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ClientChannelManager extends CachedManager<Snowflake, AnyChannel> {
    public constructor(client: Client) {
        super(client);
    }

    public _createChannel(data: APIChannel, guild?: Guild): AnyChannel {
        let channel;

        switch (data.type) {
            case ChannelType.DM:
                channel = new DMChannel(this.client, data);
                break;
            case ChannelType.GroupDM:
                channel = new GroupDMChannel(this.client, data);
                break;
        }

        if (guild) {
            switch (data.type) {
                case ChannelType.GuildCategory:
                    channel = new CategoryChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildAnnouncement:
                    channel = new AnnouncementChannel(this.client, guild, data);
                    break;
                case ChannelType.AnnouncementThread:
                case ChannelType.PrivateThread:
                case ChannelType.PublicThread:
                    channel = new ThreadChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildStageVoice:
                    channel = new StageChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildText:
                    channel = new TextChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildVoice:
                    channel = new VoiceChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildForum:
                    channel = new ForumChannel(this.client, guild, data);
                    break;
            }
        }

        // @ts-ignore
        return channel;
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/channels/${id}`, { reason: reason as string });
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: EditChannelData, reason?: string): Promise<AnyChannel> {
        const channel = await this.client.rest.patch<APIChannel>(`/channels/${id}`, {
            body: await ChannelDataResolver(data),
            reason: reason as string,
        });

        let _channel = this.cache.get(id)!;

        if (_channel) {
            _channel = _channel._patch(channel as any);
        }

        return this.cache._add(channel.id, _channel ?? this._createChannel(channel));
    }

    public async fetch(
        id: Snowflake,
        { force }: FetchOptions = { force: false }
    ): Promise<AnyChannel> {
        let _channel = this.cache.get(id)!;

        if (!force && _channel) {
            return _channel;
        } else {
            const channel = await this.client.rest.get<APIChannel>(`/channels/${id}`);

            if (_channel) {
                _channel = _channel._patch(channel as any);
            }

            return this.cache._add(channel.id, _channel ?? this._createChannel(channel));
        }
    }

    public async fetchMessages(
        channelId: Snowflake,
        messageId?: Snowflake
    ): Promise<CollectionLike<Snowflake, Message>> {
        if (messageId) {
            const message = await this.client.rest.get<APIMessage>(
                `/channels/${channelId}/messages/${messageId}`
            );

            const _channel = this.cache.get(channelId)!;

            if (_channel) {
                (_channel as any).caches.messages.cache.set(
                    message.id,
                    new Message(this.client, message)
                );
            }

            return new Message(this.client, message);
        } else {
            const messages = await this.client.rest.get<APIMessage[]>(
                `/channels/${channelId}/messages`
            );

            const result = new Collection<Snowflake, Message>();

            const _channel = this.cache.get(channelId)!;

            for (const message of messages) {
                result.set(message.id, new Message(this.client, message));
            }

            if (_channel) {
                (_channel as any).caches.messages.cache.clear();
                (_channel as any).caches.messages.cache.concat(result);
            }

            return result;
        }
    }

    public async deleteMessage(channelId: Snowflake, messageId: Snowflake, reason?: string) {
        await this.client.rest.delete(`/channels/${channelId}/messages/${messageId}`, {
            reason: reason,
        });

        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            (_channel as any).caches.messages.cache.delete(messageId);
        }
    }

    public async editMessage(
        channelId: Snowflake,
        messageId: Snowflake,
        data: EditMessageData
    ): Promise<Message> {
        let files;

        if (data.files) {
            files = await Promise.all(data.files.map((file) => DataResolver.resolveFile(file)));
        }

        if (data.embeds) {
            for (const embed of data.embeds) {
                embed.color &&= ColorResolver(embed.color);
            }
        }

        if (data.flags) {
            data.flags = new MessageFlagsBitField().set(MessageFlagsBitsResolver(data.flags!));
        }

        if (data.attachments) {
            data.attachments = data.attachments.map((attachment) => {
                return {
                    filename: attachment.filename,
                    description: attachment.description,
                };
            });
        }

        data = deleteProperty(data, 'files');

        const message = await this.client.rest.patch<APIMessage>(
            `/channels/${channelId}/messages/${messageId}`,
            {
                body: data,
                files,
            }
        );

        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            // @ts-ignore
            let _message = (_channel as any).caches.messages.cache.get(messageId);

            if (_message) {
                _message = _message._patch(message);
            } else {
                _message = new Message(this.client, message);
            }

            return _message;
        } else {
            return new Message(this.client, message);
        }
    }

    public async createMessage(channelId: Snowflake, data: CreateMessageData) {
        let files;

        if (data.files) {
            files = await Promise.all(data.files.map((file) => DataResolver.resolveFile(file)));
        }

        if (data.embeds) {
            for (const embed of data.embeds) {
                embed.color &&= ColorResolver(embed.color);
            }
        }

        if (data.flags) {
            data.flags = MessageFlagsBitsResolver(data.flags!);
        }

        if (data.message_reference) {
            data.message_reference.fail_if_not_exists ??= this.client.failIfNotExists;
        }

        if (data.attachments) {
            data.attachments = data.attachments.map((attachment) => {
                return {
                    filename: attachment.filename,
                    description: attachment.description,
                };
            });
        }

        // @ts-ignore
        data.sticker_ids = data.stickers;

        data = deleteProperty(data, 'stickers');
        data = deleteProperty(data, 'files');

        const message = await this.client.rest.post<APIMessage>(`/channels/${channelId}/messages`, {
            body: data,
            files,
        });

        const _message = new Message(this.client, message);

        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            (_channel as any).caches?.messages?.cache.set(message.id, _message);
        }

        return _message;
    }

    public async crosspostMessage(channelId: Snowflake, messageId: Snowflake) {
        const message = await this.client.rest.post<APIMessage>(
            `/channels/${channelId}/messages/${messageId}/crosspost`
        );

        const _channel = this.cache.get(channelId)!;
        const _message = new Message(this.client, message);

        if (_channel) {
            (_channel as any).caches.messages.cache.set(message.id, _message);
        }

        return _message;
    }

    public async triggerTyping(id: Snowflake) {
        await this.client.rest.post(`/channels/${id}/typing`);
    }

    public async fetchPins(id: Snowflake) {
        const pins = await this.client.rest.get<APIMessage[]>(`/channels/${id}/pins`);

        const _channel = this.cache.get(id)! as TextBasedChannelResolvable;
        const result = new Collection<Snowflake, Message>(
            pins.map((message) => [message.id, new Message(this.client, message)])
        );

        if (_channel) {
            (_channel.caches as TextBasedChannelCacheManager).pins.cache.clear();
            (_channel.caches as TextBasedChannelCacheManager).pins.cache.concat(result);
        }

        return result;
    }

    public async pinMessage(channelId: Snowflake, messageId: Snowflake, reason?: string) {
        return await this.client.rest.put(`/channels/${channelId}/pins/${messageId}`, {
            reason: reason,
        });
    }

    public async unpinMessage(channelId: Snowflake, messageId: Snowflake, reason?: string) {
        return await this.client.rest.delete(`/channels/${channelId}/pins/${messageId}`, {
            reason: reason,
        });
    }
}
