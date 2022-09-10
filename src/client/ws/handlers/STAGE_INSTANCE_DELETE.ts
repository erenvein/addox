import {
    BaseWebSocketHandler,
    type GatewayStageInstanceDeleteDispatch,
    StageInstance,
} from '../../../index';

export default class StageInstanceDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayStageInstanceDeleteDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            guild.caches.stageInstances.cache.delete(d.id);
        }

        this.shard.manager.emit(
            'stageInstanceDelete',
            new StageInstance(this.shard.manager.client, d)
        );
    }
}
