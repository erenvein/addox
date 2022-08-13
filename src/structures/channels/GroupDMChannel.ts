import {
    type APIGroupDMChannel,
    type Client,
    type Snowflake,
    User,
    GroupDMChannelRecipientManager,
    DMBasedChannelCacheManager
} from '../../index';

import { BaseTextChannel } from '../base/BaseTextChannel';

export class GroupDMChannel extends BaseTextChannel {
    public applicationId!: string | null;
    public icon!: string | null;
    public ownerId!: Snowflake | null;
    public recipients!: GroupDMChannelRecipientManager;
    public caches!: DMBasedChannelCacheManager

    public constructor(client: Client, data: APIGroupDMChannel) {
        //@ts-ignore
        super(client, data);

        this._patch(data);
    }

    //@ts-ignore
    public override _patch(data: APIGroupDMChannel) {
        super._patch(data);

        this.applicationId = data.application_id ?? null;
        this.icon = data.icon ?? null;
        this.ownerId = data.owner_id ?? null;

        this.recipients ??= new GroupDMChannelRecipientManager(this.client, this);

        if ('recipients' in data) {
            this.recipients.cache.clear();

            for (const recipient of data.recipients!) {
                this.recipients.cache.set(
                    recipient.id,
                    this.client.caches.users.cache._add(
                        recipient.id,
                        new User(this.client, recipient)
                    )
                );
            }
        }

        this.caches ??= new DMBasedChannelCacheManager(this.client, this);

        return this;
    }
}
