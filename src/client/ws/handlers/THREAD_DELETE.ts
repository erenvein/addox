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
                guild.caches.channels.cache.delete(d.id);
                this.shard.manager.client.caches.channels.cache.delete(d.id);
                this.shard.manager.emit('threadDelete', thread);
            }
        }
    }
}
