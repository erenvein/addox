import type { APIVoiceChannel, Guild, Client } from '../index';

import { VoiceChannel } from './VoiceChannel';

export class StageChannel extends VoiceChannel {
    public constructor(client: Client, guild: Guild, data: APIVoiceChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIVoiceChannel) {
        super._patch(data);

        return this;
    }
}
