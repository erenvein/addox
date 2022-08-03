import type { Client, Guild, APIGuildWidgetChannel } from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class GuildWidgetChannel extends BaseStructure {
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIGuildWidgetChannel) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildWidgetChannel) {
        return this;
    }
}
