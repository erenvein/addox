import {
    type GatewayThreadMemberUpdateDispatch,
    type ThreadChannel,
    BaseWebSocketHandler,
    ThreadMember,
} from '../../../index';

export default class ThreadMemberUpdatesHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadMemberUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id!);

        if (guild) {
            const thread = guild.caches.channels.cache.get(d.id!) as ThreadChannel;

            if (thread) {
                const _member = thread.caches.members.cache.get(d.user_id!);

                if (_member) {
                    const member = _member;

                    _member._patch(d);

                    this.shard.manager.emit('threadMemberUpdate', thread, member, _member);
                } else {
                    this.shard.manager.emit(
                        'threadMemberAdd',
                        thread,
                        thread.caches.members.cache._add(
                            d.user_id!,
                            new ThreadMember(this.shard.manager.client, d)
                        )
                    );
                }
            }
        }
    }
}
