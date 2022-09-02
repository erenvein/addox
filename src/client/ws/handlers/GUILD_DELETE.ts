import { BaseWebSocketHandler, GatewayGuildDeleteDispatch } from '../../../index';

export default class GuildDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildDeleteDispatch) {
        const guild = this.shard.guilds.get(d.id);

        this.shard.manager.client.caches.guilds.unavailables.delete(d.id);

        if (guild) {
            this.shard.guilds.delete(d.id);
            this.shard.manager.emit('guildDelete', guild!);
        }
    }
}
