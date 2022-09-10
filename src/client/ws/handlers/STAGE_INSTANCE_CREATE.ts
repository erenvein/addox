import {
    BaseWebSocketHandler,
    type GatewayStageInstanceCreateDispatch,
    StageInstance,
} from '../../../index';

export default class StageInstanceCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayStageInstanceCreateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            this.shard.manager.emit(
                'stageInstanceCreate',
                guild.caches.stageInstances.cache._add(
                    d.id,
                    new StageInstance(this.shard.manager.client, d)
                )
            );
        }
    }
}
