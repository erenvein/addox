import { type GatewayVoiceStateUpdateDispatch, BaseWebSocketHandler, Typing } from '../../../index';

export default class VoiceStateUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayVoiceStateUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id!);

        if (guild) {
            let _voiceState = guild.caches.voiceStates.cache.get(d.user_id!);

            if (_voiceState) {
                const voiceState = _voiceState;

                _voiceState = _voiceState._patch(d);

                this.shard.manager.emit('voiceStateUpdate', voiceState, _voiceState);
            }
        }
    }
}
