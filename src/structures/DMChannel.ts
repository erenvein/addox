import { type APIDMChannel, type Client, User, DMChannelCacheManager } from '../index';

import { BaseTextChannel } from './BaseTextChannel';

export class DMChannel extends BaseTextChannel {
    public recipient!: User;
    public caches!: DMChannelCacheManager;

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

        this.caches ??= new DMChannelCacheManager(this.client, this);

        return this;
    }
}
