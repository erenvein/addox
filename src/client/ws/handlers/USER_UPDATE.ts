import { type GatewayUserUpdateDispatch, BaseWebSocketHandler, Typing } from '../../../index';

export default class UserUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayUserUpdateDispatch) {
        let _user = this.shard.manager.client.caches.users.cache.get(d.id);
      
        if (_user) {
            const user = _user;

            _user = _user._patch(d);

            this.shard.manager.emit('userUpdate', user, _user);
        }
    }
}
