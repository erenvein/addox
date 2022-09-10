import {
    type APIThreadChannel,
    type Guild,
    type Client,
    type FetchOptions,
    type EditChannelData,
    type Snowflake,
    type GatewayThreadCreateDispatchData,
    ThreadMember,
    ThreadMetadata,
    ThreadChannelCacheManager,
} from '../../index';

import { BaseGuildTextChannel } from '../base/BaseGuildTextChannel';

export class ThreadChannel extends BaseGuildTextChannel {
    public member!: ThreadMember | null;
    public memberCount!: number;
    public messageCount!: number;
    public threadMetadata!: ThreadMetadata | null;
    public totalMessageSent!: number;
    public authorId!: Snowflake | null;
    public rateLimitPerUser!: number;
    public newlyCreated!: boolean;
    public caches!: ThreadChannelCacheManager;

    public constructor(
        client: Client,
        guild: Guild,
        data: APIThreadChannel | GatewayThreadCreateDispatchData
    ) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIThreadChannel | GatewayThreadCreateDispatchData) {
        super._patch(data);

        this.member = data.member ? new ThreadMember(this.client, data.member) : null;
        this.memberCount = data.member_count ?? 1;
        this.messageCount = data.message_count ?? 0;
        this.threadMetadata = data.thread_metadata
            ? new ThreadMetadata(this.client, data.thread_metadata)
            : null;
        this.totalMessageSent = data.total_message_sent ?? 0;
        this.authorId = data.owner_id ?? null;
        this.rateLimitPerUser = data.rate_limit_per_user ?? 0;

        if ('newly_created' in data) {
            this.newlyCreated = data.newly_created ?? false;
        } else {
            this.newlyCreated ??= false;
        }

        this.caches = new ThreadChannelCacheManager(this.client, this);

        return this;
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public get author() {
        return this.guild.caches.members.cache.get(this.authorId!);
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as ThreadChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as ThreadChannel;
    }
}
