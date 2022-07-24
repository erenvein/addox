import { BaseWebSocketHandler, GatewayPresenceUpdateDispatch } from '../../../index';

export default class PresenceUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildUpdate');
    }

    public override handle({ d }: GatewayPresenceUpdateDispatch) {
        let _presence = this.shard.manager.client.caches.presences.get(d.user.id);

        if (_presence) {
            const presence = _presence;

            _presence = _presence._patch(d);

            this.shard.manager.client.caches.presences.set(presence.user?.id!, _presence);
            this.shard.manager.client.emit('presenceUpdate', presence, _presence);
        }
    }
}
