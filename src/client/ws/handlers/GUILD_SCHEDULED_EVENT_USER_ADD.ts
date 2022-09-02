import {
    BaseWebSocketHandler,
    GatewayGuildScheduledEventUserAddDispatch,
    Sticker,
} from '../../../index';

export default class GuildStickersUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildScheduledEventUserAddDispatch) {
        const guild = this.shard.guilds.get(d.guild_id)!;

        if (guild) {
            const scheduledEvent = guild.caches.scheduledEvents.cache.get(d.guild_scheduled_event_id);
            const user = this.shard.manager.client.caches.users.cache.get(d.user_id);

            if (scheduledEvent && user) {
                this.shard.manager.emit('scheduledEventUserAdd', scheduledEvent, user);
            }
        }
    }
}
