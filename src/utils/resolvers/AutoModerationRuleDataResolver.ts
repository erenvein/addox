import { type EditAndCreateAutoModerationRuleData, AutoModerationRuleEventTypes } from '../../index';

export const ChannelPattern = /<#(!)?(\d{17,19})>/;

export async function AutoModerationRuleDataResolver(rule: EditAndCreateAutoModerationRuleData) {
    const res = rule;

    if (res.event_type && typeof res.event_type !== 'number') {
        res.event_type = AutoModerationRuleEventTypes[res.event_type];
    }

    return res;
}
