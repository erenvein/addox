import {
    BaseWebSocketHandler,
    GatewayThreadMembersUpdateDispatch,
    ThreadChannel,
    ThreadMember,
    Collection,
    Snowflake,
} from '../../../index';

export default class ThreadMembersUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadMembersUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id)!;

        if (guild) {
            const thread = guild.caches.channels.cache.get(d.id) as ThreadChannel;

            if (thread) {
                const addedMembers = new Collection<Snowflake, ThreadMember>();
                const removedMembers = new Collection<Snowflake, ThreadMember>();

                if (d.added_members) {
                    for (const member of d.added_members) {
                        addedMembers.set(
                            member.id!,
                            thread.caches.members.cache._add(
                                member.id!,
                                new ThreadMember(this.shard.manager.client, member)
                            )
                        );
                    }
                }

                if (d.removed_member_ids) {
                    for (const id of d.removed_member_ids) {
                        const member = thread.caches.members.cache.get(id);
                        if (member) {
                            removedMembers.set(id, member);
                        }

                        thread.caches.members.cache.delete(id);
                    }
                }

                thread.memberCount = d.member_count;

                this.shard.manager.emit(
                    'threadMembersUpdate',
                    thread,
                    addedMembers,
                    removedMembers
                );
            }
        }
    }
}
