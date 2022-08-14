import type { APIVoiceBasedChannelResolvable, Guild, Client } from '../../index';

import { BaseGuildChannel } from '../base/BaseGuildChannel';

export class VoiceChannel extends BaseGuildChannel {
    public constructor(client: Client, guild: Guild, data: APIVoiceBasedChannelResolvable) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIVoiceBasedChannelResolvable) {
        super._patch(data);

        // TODO

        return this;
    }
}
