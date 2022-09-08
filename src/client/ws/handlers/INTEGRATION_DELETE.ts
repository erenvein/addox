import {
    BaseWebSocketHandler,
    type GatewayIntegrationDeleteDispatch,
} from '../../../index';

export default class IntegrationDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayIntegrationDeleteDispatch) {
        const guild = this.shard.manager.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        const integration = guild.caches.integrations.cache.get(d.id);

        if (integration) {
            guild.caches.integrations.cache.delete(d.id);
            this.shard.manager.emit('integrationDelete', integration);
        }
    }
}
