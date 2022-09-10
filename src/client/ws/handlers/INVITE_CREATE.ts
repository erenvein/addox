import {
    type GatewayInviteCreateDispatch,
    BaseWebSocketHandler,
    GuildBasedInvitableChannelResolvable,
    Invite,
} from '../../../index';

export default class InviteCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayInviteCreateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id!);

        if (guild) {
            const channel = this.shard.manager.client.caches.channels.cache.get(
                d.channel_id
            ) as GuildBasedInvitableChannelResolvable;

            if (channel) {
                this.shard.manager.emit(
                    'inviteCreate',
                    channel.caches.invites.cache._add(
                        d.code,
                        new Invite(this.shard.manager.client, d)
                    )
                );
            }
        }
    }
}
