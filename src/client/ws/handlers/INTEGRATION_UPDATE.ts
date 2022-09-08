import {
    BaseWebSocketHandler,
    type GatewayIntegrationUpdateDispatch,
    GuildIntegration,
} from '../../../index';

export default class IntegrationUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayIntegrationUpdateDispatch) {
        const guild = this.shard.manager.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        let _integration = guild.caches.integrations.cache.get(d.id);

        if (_integration) {
            const integration = _integration;
            _integration = _integration._patch(d);

            this.shard.manager.emit('integrationUpdate', integration, _integration);
        } else {
            this.shard.manager.emit(
                'integrationCreate',
                guild.caches.integrations.cache._add(
                    d.id,
                    new GuildIntegration(this.shard.manager.client, guild, d)
                )
            );
        }
    }
}
