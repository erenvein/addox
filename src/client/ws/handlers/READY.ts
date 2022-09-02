import {
    BaseWebSocketHandler,
    ClientUser,
    GatewayReadyDispatch,
    UnavailableGuild,
} from '../../../index';

export default class ReadyHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayReadyDispatch) {
        this.shard.uptime = Date.now();
        this.shard.sessionId = d.session_id;
        this.shard.status = 'Ready';

        if (this.shard.manager.client.user) {
            this.shard.manager.client.user._patch(d.user);
        } else {
            this.shard.manager.client.user = new ClientUser(this.shard.manager.client, d.user);
        }

        for (const guild of d.guilds) {
            this.shard.manager.client.caches.guilds.unavailables.set(
                guild.id,
                new UnavailableGuild(this.shard.manager.client, guild)
            );
        }

        this.shard.emit('ready', this.shard);
    }
}
