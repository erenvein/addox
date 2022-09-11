import {
    type GatewayThreadUpdateDispatch,
    type APIThreadChannel,
    BaseWebSocketHandler,
    ThreadChannel,
} from '../../../index';

export default class ThreadUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadUpdateDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            let _thread = guild.caches.channels.cache.get(d.id) as ThreadChannel;

            if (_thread) {
                const thread = _thread;

                _thread = _thread._patch(d as APIThreadChannel);

                this.addChannelToEveryting(_thread, guild);
                this.shard.manager.emit('threadUpdate', thread, _thread);
            }
        }
    }
}
