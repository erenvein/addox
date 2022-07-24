import type { Client, Guild, APIGuildWidgetChannel, APIPartialChannel } from '../index';

import { BaseChannel } from './BaseChannel';

export class GuildWidgetChannel extends BaseChannel {
    public rawPosition!: number;
    public constructor(client: Client, guild: Guild, data: APIGuildWidgetChannel) {
        super(client, guild, data as unknown as APIPartialChannel);

        this._patch(data);
    }

    // @ts-ignore
    public override _patch(data: APIGuildWidgetChannel) {
        super._patch(data as unknown as APIPartialChannel);

        this.rawPosition = data.position;

        return this;
    }
}
