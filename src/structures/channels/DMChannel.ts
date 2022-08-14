import {
    type APIDMChannel,
    type Client,
    type CreateMessageData,
    User,
    TextBasedChannelCacheManager,
} from '../../index';

import { BaseTextChannel } from '../base/BaseTextChannel';

export class DMChannel extends BaseTextChannel {
    public recipient!: User;
    public caches!: TextBasedChannelCacheManager;

    public constructor(client: Client, data: APIDMChannel) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIDMChannel) {
        super._patch(data);

        const recipient = data.recipients![0]!;

        let _user = this.client.caches.users.cache.get(recipient.id);

        if (_user) {
            _user = _user._patch(recipient);
            this.recipient = this.client.caches.users.cache._add(_user.id, _user);
        } else {
            _user = new User(this.client, recipient);

            this.recipient = _user;
            this.client.caches.users.cache.set(_user.id, _user);
        }

        this.caches ??= new TextBasedChannelCacheManager(this.client, this);

        return this;
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public async send(data: CreateMessageData) {
        return this.caches.messages.create(data);
    }
}
