import type {
    Snowflake,
    Client,
    Guild,
    AutoModerationRule,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class GuildAutoModerationRuleManager extends CachedManager<Snowflake, AutoModerationRule> {
    public guild!: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async delete() {
        // TODO
    }

    public async edit() {
        // TODO
    }

    public async fetch() {
        // TODO
    }

    public async create() {
        // TODO
    }
}
