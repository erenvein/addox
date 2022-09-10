import {
    BaseWebSocketHandler,
    type GatewayStageInstanceUpdateDispatch,
    GuildIntegration,
} from '../../../index';

export default class StageInstanceUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayStageInstanceUpdateDispatch) {
        const guild = this.shard.manager.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        let _stageInstance = guild.caches.stageInstances.cache.get(d.id);

        if (_stageInstance) {
            const integration = _stageInstance;
            _stageInstance = _stageInstance._patch(d);

            this.shard.manager.emit('stageInstanceUpdate', integration, _stageInstance);
        }
    }
}
