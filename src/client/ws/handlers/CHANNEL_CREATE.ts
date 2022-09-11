import {
    BaseWebSocketHandler,
    GatewayChannelCreateDispatch,
    GuildBasedChannelResolvable,
} from '../../../index';

export default class ChannelCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelCreateDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const channel = this.shard.manager.client.caches.channels._createChannel(
                d,
                guild
            ) as GuildBasedChannelResolvable;

            this.addChannelToEveryting(channel, guild);

            this.shard.manager.emit('channelCreate', channel);
        }
    }
}
