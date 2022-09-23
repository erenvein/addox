import type { Collection } from '../../index';

export function CacheStaler<C extends Collection<unknown, unknown>>(cache: C, interval: number) {
    return setInterval(() => {
        cache.clear();
    }, interval);
}
