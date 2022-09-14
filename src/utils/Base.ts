import type { ArrayLike } from '../index';

export const deleteProperty = <T extends object>(obj: T, keys: ArrayLike<string>): T => {
    if (Array.isArray(keys)) {
        for (const key of keys) {
            if (obj.hasOwnProperty(key)) {
                delete obj[key];
            }
        }
    } else {
        if (obj.hasOwnProperty(keys)) {
            delete obj[keys];
        }
    }

    return obj;
};
