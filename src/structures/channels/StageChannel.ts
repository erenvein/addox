import type { APIVoiceChannel, Guild, Client, EditChannelData, FetchOptions } from '../../index';

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

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as StageChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as StageChannel;
    }
}
