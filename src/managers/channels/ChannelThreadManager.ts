import type {
    ThreadableChannelResolvable,
    Snowflake,
    Client,
    FetchOptions,
    FetchArchivedThreadOptions,
    StartThreadData,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ChannelThreadManager extends CachedManager<Snowflake, ThreadableChannelResolvable> {
    public channel: ThreadableChannelResolvable;

    public constructor(client: Client, channel: ThreadableChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public async start(data: StartThreadData, reason?: string | null, messageId?: Snowflake) {
   
        return await this.channel.guild.caches.channels.startThread(
            this.channel.id,
            data,
            reason,
            messageId
        );
    }

    public async join() {
        return await this.channel.guild.caches.channels.joinThread(this.channel.id);
    }

    public async leave() {
        return await this.channel.guild.caches.channels.leaveThread(this.channel.id);
    }

    public async addMember(id: Snowflake) {
        return await this.channel.guild.caches.channels.addThreadMember(this.channel.id, id);
    }

    public async removeMember(id: Snowflake) {
        return await this.channel.guild.caches.channels.removeThreadMember(this.channel.id, id);
    }

    public async fetchMembers(id?: Snowflake, options?: FetchOptions) {
        return await this.channel.guild.caches.channels.fetchThreadMembers(
            this.channel.id,
            id,
            options
        );
    }

    public async fetchActives() {
        return await this.channel.guild.caches.channels.fetchActiveThreads();
    }

    public async fetchPublicArchived(options?: FetchArchivedThreadOptions) {
        return await this.channel.guild.caches.channels.fetchPublicArchivedThreads(
            this.channel.id,
            options
        );
    }

    public async fetchPrivateArchived(options?: FetchArchivedThreadOptions) {
        return await this.channel.guild.caches.channels.fetchPrivateArchivedThreads(
            this.channel.id,
            options
        );
    }

    public async fetchJoins(options?: FetchArchivedThreadOptions) {
        return await this.channel.guild.caches.channels.fetchJoinedThreads(
            this.channel.id,
            options
        );
    }
}
