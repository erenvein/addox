import {
    type GatewayThreadListSyncDispatch,
    type APIThreadChannel,
    type ThreadableChannelResolvable,
    type Snowflake,
    BaseWebSocketHandler,
    NewsChannel,
    TextChannel,
    Collection,
    ThreadChannel,
    ThreadMember,
} from '../../../index';

export default class ThreadListSyncHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadListSyncDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            if (d.channel_ids) {
                for (const id of d.channel_ids) {
                    const channel = guild.caches.channels.cache.get(
                        id
                    ) as ThreadableChannelResolvable;

                    if (channel) {
                        for (const thread of channel.caches.threads.cache.values()) {
                            this.removeChannelFromEveryting(thread.id, guild);
                        }
                    }
                }
            } else {
                for (const channel of guild.caches.channels.cache.values()) {
                    if (channel instanceof TextChannel || channel instanceof NewsChannel) {
                        for (const thread of channel.caches.threads.cache.values()) {
                            this.removeChannelFromEveryting(thread.id, guild);
                        }
                    }
                }
            }

            const syncedThreads = d.threads.reduce((accumulator, thread) => {
                return accumulator.set(
                    thread.id,
                    new ThreadChannel(this.shard.manager.client, guild, thread as APIThreadChannel)
                );
            }, new Collection<Snowflake, ThreadChannel>());

            for (const thread of syncedThreads.values()) {
                for (const member of d.members) {
                    if (member.id === thread.id) {
                        thread.caches.members.cache.set(
                            member.user_id!,
                            new ThreadMember(this.shard.manager.client, member)
                        );
                    }
                }

                this.addChannelToEveryting(thread, guild);
            }

            this.shard.manager.emit('threadListSync', syncedThreads, guild);
        }
    }
}
