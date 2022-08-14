import {
    type APIGroupDMChannel,
    type Client,
    type Snowflake,
    User,
    type CreateMessageData,
    GroupDMChannelCacheManager,
} from '../../index';

import { BaseTextChannel } from '../base/BaseTextChannel';

export class GroupDMChannel extends BaseTextChannel {
    public applicationId!: string | null;
    public icon!: string | null;
    public ownerId!: Snowflake | null;
    public caches!: GroupDMChannelCacheManager;

    public constructor(client: Client, data: APIGroupDMChannel) {
        //@ts-ignore
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIGroupDMChannel) {
        super._patch(data);

        this.applicationId = data.application_id ?? null;
        this.icon = data.icon ?? null;
        this.ownerId = data.owner_id ?? null;

        this.caches ??= new GroupDMChannelCacheManager(this.client, this);

        if ('recipients' in data) {
            this.caches.recipients.cache.clear();

            for (const recipient of data.recipients!) {
                this.caches.recipients.cache.set(
                    recipient.id,
                    this.client.caches.users.cache._add(
                        recipient.id,
                        new User(this.client, recipient)
                    )
                );
            }
        }

        return this;
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public async send(data: CreateMessageData) {
        return this.caches.messages.create(data);
    }
}
