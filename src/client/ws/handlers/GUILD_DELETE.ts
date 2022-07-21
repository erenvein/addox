import { BaseWebSocketHandler, GatewayGuildDeleteDispatch } from '../../..';

export default class GuildDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildDelete');
    }

    public handle({ d }: GatewayGuildDeleteDispatch) {
        const guild = this.shard.guilds.get(d.id);
        this.shard.guilds.delete(d.id);

        this.shard.manager.client.emit('GuildCreate', guild!);
    }
}
