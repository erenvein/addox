import { BaseWebSocketHandler, GatewayGuildIntegrationsUpdateDispatch, Sticker } from '../../../index';

export default class GuildIntegrationsUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildIntegrationsUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);
        if (!guild) return;

        this.shard.manager.emit('guildIntegrationsUpdate', guild);
    }
}
