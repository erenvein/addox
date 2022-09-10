import {
    type GatewayGuildScheduledEventUpdateDispatch,
    BaseWebSocketHandler,
} from '../../../index';

export default class GuildScheduledEventUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildScheduledEventUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id)!;

        if (guild) {
            let _event = guild.caches.scheduledEvents.cache.get(d.id);

            if (_event) {
                const event = _event;

                _event = _event._patch(d);

                this.shard.manager.emit('guildScheduledEventUpdate', event, _event);
            }
        }
    }
}
