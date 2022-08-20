import {
    Snowflake,
    Client,
    ThreadChannel,
    CollectionLike,
    FetchOptions,
    ThreadMember,
    Collection,
    APIThreadMember,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ThreadChannelMemberManager extends CachedManager<Snowflake, ThreadMember> {
    public channel: ThreadChannel;

    public constructor(client: Client, channel: ThreadChannel) {
        super(client);

        this.channel = channel;
    }

    public async add(id: Snowflake): Promise<void> {
        return await this.client.rest.put(`/channels/${this.channel.id}/thread-members/${id}`);
    }

    public async remove(id: Snowflake): Promise<void> {
        return await this.client.rest.delete(`/channels/${this.channel.id}/thread-members/${id}`);
    }

    public async fetch(
        id?: Snowflake,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, ThreadMember>> {
        if (id) {
            let _member = this.cache.get(id)!;

            if (!force && _member) {
                return _member;
            } else {
                const member = await this.client.rest.get<APIThreadMember>(
                    `/channels/${this.channel.id}/thread-members/${id}`
                );

                if (_member) {
                    _member = _member._patch(member);
                }

                return this.cache._add(
                    _member.userId!,
                    _member ?? new ThreadMember(this.client, member)
                );
            }
        } else {
            const members = await this.client.rest.get<APIThreadMember[]>(
                `/channels/${this.channel.id}/thread-members`
            );

            const result = new Collection<Snowflake, ThreadMember>();

            for (const member of members) {
                let _member = this.cache.get(member.id!)!;

                if (_member) {
                    _member = _member._patch(member as never);
                }

                result.set(_member.userId!, _member ?? new ThreadMember(this.client, member));
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }
}
