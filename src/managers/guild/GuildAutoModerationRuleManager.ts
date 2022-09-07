import type {
    Snowflake,
    Client,
    Guild,
    AutoModerationRule,
    CollectionLike,
    FetchOptions,
    Collection,
    EditAndCreateAutoModerationRuleData,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class GuildAutoModerationRuleManager extends CachedManager<Snowflake, AutoModerationRule> {
    public guild!: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async delete(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return await this.client.caches.guilds.deleteAutoModerationRule(this.guild.id, id, reason);
    }

    public async fetch(
        id?: Snowflake,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, AutoModerationRule>> {
        if (id) {
            const _rule = this.cache.get(id);

            if (_rule && !force) {
                return _rule;
            } else {
                const rule = (await this.client.caches.guilds.fetchAutoModerationRules(
                    this.guild.id,
                    id
                )) as AutoModerationRule;

                return this.cache.set(rule.id!, rule);
            }
        } else {
            const rules = (await this.client.caches.guilds.fetchAutoModerationRules(
                this.guild.id
            )) as Collection<Snowflake, AutoModerationRule>;

            this.cache.clear();
            this.cache.concat(rules);
        }

        return this.cache;
    }

    public async edit(id: Snowflake, data: EditAndCreateAutoModerationRuleData, reason?: string) {
        const rule = await this.client.caches.guilds.editAutoModerationRule(
            this.guild.id,
            id,
            data,
            reason
        );

        return this.cache._add(rule.id!, rule);
    }

    public async create(data: EditAndCreateAutoModerationRuleData, reason?: string) {
        const rule = await this.client.caches.guilds.createAutoModerationRule(
            this.guild.id,
            data,
            reason
        );

        return this.cache._add(rule.id!, rule);
    }
}
