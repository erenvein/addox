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

            if (activity.applicationId) {
                (activity as any).application_id = activity.applicationId;
                delete activity.applicationId;
            }

            if (activity.assets) {
                for (const asset of activity.assets) {
                    if (asset.largeImage) {
                        (asset as any).large_image = asset.largeImage;
                        delete asset.largeImage;
                    }

                    if (asset.largeText) {
                        (asset as any).large_text = asset.largeText;
                        delete asset.largeText;
                    }

                    if (asset.smallImage) {
                        (asset as any).small_image = asset.smallImage;
                        delete asset.smallImage;
                    }

                    if (asset.smallText) {
                        (asset as any).small_text = asset.smallText;
                        delete asset.smallText;
                    }
                }
            }
        }
    }

    return res;
}
