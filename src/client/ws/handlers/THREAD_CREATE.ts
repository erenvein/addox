import {
    type GatewayThreadCreateDispatch,
    BaseWebSocketHandler,
    ThreadChannel,
} from '../../../index';

export default class ThreadCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadCreateDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            this.shard.manager.emit(
                'threadCreate',
                guild.caches.channels.cache._add(
                    d.id,
                    this.shard.manager.client.caches.channels.cache._add(
                        d.id,
                        //@ts-ignore
                        new ThreadChannel(this.shard.manager.client, guild, d)
                    ) as ThreadChannel
                ) as ThreadChannel
            );
        }
    }
}
