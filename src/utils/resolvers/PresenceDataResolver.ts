import { type PresenceData, ActivityType, ActivityFlags } from '../..';

export function PresenceDataResolver(presence: PresenceData) {
    const res = presence;

    if (res.activities) {
        for (const activity of res.activities) {
            if (typeof activity.type === 'string') {
                activity.type = ActivityType[activity.type as keyof typeof ActivityType];
            }

            if (typeof activity.flags === 'string') {
                activity.flags = ActivityFlags[activity.flags as keyof typeof ActivityFlags];
            }
        }
    }

    return res;
}
