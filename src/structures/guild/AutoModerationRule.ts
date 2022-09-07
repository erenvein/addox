import {
    Client,
    Snowflake,
    APIAutoModerationRuleData,
    AutoModerationRuleActionData,
    AutoModerationRuleEventTypes,
    AutoModerationRuleActionTypes,
    AutoModerationRuleTriggerMetadata,
    AutoModerationRuleTriggerTypes,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class AutoModerationRule extends BaseStructure {
    public actions!: AutoModerationRuleActionData[];
    public authorId!: Snowflake;
    public id!: Snowflake;
    public guildId!: Snowflake;
    public enabled!: boolean;
    public eventType!: keyof typeof AutoModerationRuleEventTypes;
    public exemptChannelsIds!: Snowflake[];
    public exemptRolesIds!: Snowflake[];
    public name!: string;
    public triggerMetadata!: AutoModerationRuleTriggerMetadata;
    public triggerType!: keyof typeof AutoModerationRuleTriggerTypes;

    public constructor(client: Client, data: APIAutoModerationRuleData) {
        super(client);

        this._patch(data);
    }

    public _patch(data: APIAutoModerationRuleData) {
        this.actions = [];
        this.authorId = data.creator_id;
        this.enabled = data.enabled;
        this.eventType = AutoModerationRuleEventTypes[
            data.event_type
        ] as keyof typeof AutoModerationRuleEventTypes;
        this.exemptChannelsIds = data.exempt_channels;
        this.exemptRolesIds = data.exempt_roles;
        this.guildId = data.guild_id;
        this.id = data.id;
        this.name = data.name;
        this.triggerMetadata = {
            allowList: data.trigger_metadata.allow_list,
            keywordFilter: data.trigger_metadata.keyword_filter,
            mentionTotalLimit: data.trigger_metadata.mention_total_limit,
            presets: data.trigger_metadata.presets,
        };
        this.triggerType = AutoModerationRuleTriggerTypes[
            data.trigger_type
        ] as keyof typeof AutoModerationRuleTriggerTypes;

        for (const action of data.actions) {
            this.actions.push({
                metadata: action.metadata
                    ? {
                          channelId: action.metadata.channel_id,
                          durationSeconds: action.metadata.duration_seconds,
                      }
                    : null,
                type: AutoModerationRuleActionTypes[
                    action.type
                ] as keyof typeof AutoModerationRuleActionTypes,
            });
        }

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId);
    }

    public get author() {
        return this.client.caches.users.cache.get(this.authorId);
    }

    public get exemptRoles() {
        return this.guild!.caches.roles.cache.filter((role) =>
            this.exemptRolesIds.includes(role.id)
        );
    }

    public get exemptChannels() {
        return this.guild!.caches.channels.cache.filter((channel) =>
            this.exemptChannelsIds.includes(channel.id)
        );
    }
}
