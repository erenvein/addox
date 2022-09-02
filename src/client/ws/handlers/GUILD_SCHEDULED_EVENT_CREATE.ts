import {
    BaseWebSocketHandler,
    GatewayGuildScheduledEventCreateDispatch,
    GuildScheduledEvent
} from '../../../index';

export default class GuildScheduledEventCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildScheduledEventCreateDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const scheduledEvent = new GuildScheduledEvent(this.shard.manager.client, d);

            guild.caches.scheduledEvents.cache.set(scheduledEvent.id, scheduledEvent);

            this.shard.manager.emit('scheduledEventCreate', scheduledEvent);
        }
    }
}
