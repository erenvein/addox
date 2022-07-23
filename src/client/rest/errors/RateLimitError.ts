import type { RequestMethods } from '../../../';

export class RateLimitError extends Error {
    public limit: string;
    public remaining: string;
    public reset: string;
    public hash: string;
    public retry: string;
    public scope: 'global' | 'shared' | 'user';
    public status: number;
    public method: RequestMethods;
    public url: string;

    public constructor(
        limit: string,
        remaining: string,
        reset: string,
        hash: string,
        retry: string,
        scope: 'global' | 'shared' | 'user',
        status: number,
        method: RequestMethods,
        url: string
    ) {
        super('You Are Being Rate Limited');

        this.limit = limit;
        this.remaining = remaining;
        this.reset = reset;
        this.hash = hash;
        this.retry = retry;
        this.scope = scope;
        this.status = status;
        this.method = method;
        this.url = url;
    }
}
