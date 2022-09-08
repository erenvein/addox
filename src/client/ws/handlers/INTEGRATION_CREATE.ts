import {
    BaseWebSocketHandler,
    type GatewayIntegrationCreateDispatch,
    GuildIntegration,
} from '../../../index';

export default class IntegrationCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayIntegrationCreateDispatch) {
        const guild = this.shard.manager.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        this.shard.manager.emit(
            'integrationCreate',
            guild.caches.integrations.cache._add(
                d.id,
                new GuildIntegration(this.shard.manager.client, guild, d)
            )
        );
    }
}
