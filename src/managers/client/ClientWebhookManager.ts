import type { Snowflake, Webhook, Client, FetchOptions } from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ClientWebhookManager extends CachedManager<Snowflake, Webhook> {
    public constructor(client: Client) {
        super(client);
    }

    public async create(id: Snowflake) {
        // TODO
    }

    public async fetch(
        id?: Snowflake,
        token?: string | null,
        { force }: FetchOptions = { force: false }
    ) {
        // TODO
    }

    public async edit(channelId: Snowflake, webhookId: Snowflake, token?: string | null) {
        // TODO
    }

    public async createMessage() {
        // TODO
    }

    public async editMessage(id: Snowflake) {
        // TODO
    }

    public async deleteMessage(id: Snowflake) {
        // TODO
    }
}
