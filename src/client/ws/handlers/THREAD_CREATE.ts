import {
    type GatewayThreadCreateDispatch,
    type APIThreadChannel,
    ThreadChannel,
    BaseWebSocketHandler,
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
                this.addChannelToEveryting(
                    new ThreadChannel(this.shard.manager.client, guild, d as APIThreadChannel),
                    guild
                ) as ThreadChannel
            );
        }
    }
}
