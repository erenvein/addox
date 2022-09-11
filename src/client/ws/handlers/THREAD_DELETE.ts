import {
    type GatewayThreadDeleteDispatch,
    BaseWebSocketHandler,
    ThreadChannel,
} from '../../../index';

export default class ThreadCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadDeleteDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const thread = guild.caches.channels.cache.get(d.id) as ThreadChannel;

            if (thread) {
                this.addChannelToEveryting(thread, guild);
                this.shard.manager.emit('threadDelete', thread);
            }
        }
    }
}
