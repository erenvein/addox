import {
    Snowflake,
    Webhook,
    Client,
    FetchOptions,
    CreateWebhookData,
    DataResolver,
    APIWebhook,
    EditWebhookData,
    APIMessage,
    Message,
    EditWebhookMessageData,
    ColorResolver,
    CreateWebhookMessageData,
    CreateWebhookMessageOptions,
    MessageFlagsBitField,
    MessageFlagsBitsResolver,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ClientWebhookManager extends CachedManager<Snowflake, Webhook> {
    public constructor(client: Client) {
        super(client);
    }

    public async create(id: Snowflake, data: CreateWebhookData, reason?: string) {
        if (data.avatar) {
            const resolvedImage = await DataResolver.resolveImage(data.avatar, 'image/jpeg');

            data.avatar = resolvedImage;
        }

        const webhook = await this.client.rest.post<APIWebhook>(`/channels/${id}/webhooks`, {
            body: data,
            reason: reason,
        });

        return this.cache._add(webhook.id, new Webhook(this.client, webhook));
    }

    public async fetch(id: Snowflake, { force }: FetchOptions = { force: false }) {
        let _webhook = this.cache.get(id);

        if (!force && _webhook) {
            return _webhook;
        } else {
            const webhook = await this.client.rest.get<APIWebhook>(`/webhooks/${id}`);

            if (_webhook) {
                _webhook = _webhook._patch(webhook);
            }

            return this.cache._add(webhook.id, _webhook ?? new Webhook(this.client, webhook));
        }
    }

    public async fetchGuildWebhooks(id: Snowflake) {
        const webhooks = await this.client.rest.get<APIWebhook[]>(`/guilds/${id}/webhooks`);
        return webhooks.map((webhook) => new Webhook(this.client, webhook));
    }

    public async edit(id: Snowflake, data: EditWebhookData, reason?: string) {
        if (data.avatar) {
            const resolvedImage = await DataResolver.resolveImage(data.avatar, 'image/jpeg');

            data.avatar = resolvedImage;
        }

        const webhook = await this.client.rest.patch<APIWebhook>(`/webhooks/${id}`, {
            body: data,
            reason: reason,
        });

        return this.cache._add(webhook.id, new Webhook(this.client, webhook));
    }

    public async delete(id: Snowflake, token?: string | null, reason?: string) {
        return await this.client.rest.delete<void>(`/webhooks/${id}${token ? `/${token}` : ''}`, {
            reason: reason,
        });
    }

    public async createMessage(
        id: Snowflake,
        token: string,
        data: CreateWebhookMessageData,
        { wait, thread_id }: CreateWebhookMessageOptions = { wait: false }
    ) {
        if (data.files) {
            const files = [];

            for await (const file of data.files) {
                files.push(await DataResolver.resolveFile(file));
            }

            //@ts-ignore
            data.files = files;
        }

        if (data.embeds) {
            for (const embed of data.embeds) {
                embed.color &&= ColorResolver(embed.color);
            }
        }

        if ('flags' in data) {
            data.flags = new MessageFlagsBitField().set(MessageFlagsBitsResolver(data.flags!));
        }

        const message = await this.client.rest.post<APIMessage>(`/webhooks/${id}/${token}`, {
            body: data,
            appendBodyToFormData: true,
            // @ts-ignore
            files: data.files,
            query: { thread_id, wait },
        });

        return new Message(this.client, message);
    }

    public async fetchMessage(
        webhookId: Snowflake,
        token: string,
        messageId: Snowflake,
        threadId?: Snowflake
    ) {
        const message = await this.client.rest.get<APIMessage>(
            `/webhooks/${webhookId}/${token}/messages/${messageId}`,
            {
                query: { thread_id: threadId },
            }
        );

        return new Message(this.client, message);
    }

    public async editMessage(
        webhookId: Snowflake,
        token: string,
        messageId: Snowflake,
        data: EditWebhookMessageData,
        threadId?: Snowflake
    ) {
        if (data.files) {
            const files = [];

            for await (const file of data.files) {
                files.push(await DataResolver.resolveFile(file));
            }

            //@ts-ignore
            data.files = files;
        }

        if (data.embeds) {
            for (const embed of data.embeds) {
                embed.color &&= ColorResolver(embed.color);
            }
        }

        const message = await this.client.rest.patch<APIMessage>(
            `/webhooks/${webhookId}/${token}/messages/${messageId}`,
            {
                body: data,
                query: { thread_id: threadId },
                appendBodyToFormData: true,
                // @ts-ignore
                files: data.files,
            }
        );

        return new Message(this.client, message);
    }

    public async deleteMessage(
        webhookId: Snowflake,
        token: string,
        messageId: Snowflake,
        threadId?: Snowflake
    ) {
        return await this.client.rest.delete<void>(
            `/webhooks/${webhookId}/${token}/messages/${messageId}`,
            {
                query: { thread_id: threadId },
            }
        );
    }

    public async createSlackMessage(
        id: Snowflake,
        token: Snowflake,
        options?: CreateWebhookMessageOptions
    ) {
        const data = await this.client.rest.post<any>(`/webhooks/${id}/${token}/slack`, {
            query: options,
        });

        return data.toString() === 'ok';
    }

    public async createGithubMessage(
        id: Snowflake,
        token: Snowflake,
        options?: CreateWebhookMessageOptions
    ) {
        const data = await this.client.rest.post<any>(`/webhooks/${id}/${token}/github`, {
            query: options,
        });

        return data.toString() === 'ok';
    }
}
