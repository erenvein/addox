export class RateLimitError extends Error {
    public limit: string;
    public remaining: string;
    public reset: string;
    public hash: string;
    public retry: string;
    public scope: 'global' | 'shared' | 'user';
    public message: string;
    public status: number;
    public method: string;
    public url: string;

    public constructor(
        limit: string,
        remaining: string,
        reset: string,
        hash: string,
        retry: string,
        scope: 'global' | 'shared' | 'user',
        status: number,
        method: string,
        url: string,
        message: string
    ) {
        super(message);

        this.limit = limit;
        this.remaining = remaining;
        this.reset = reset;
        this.hash = hash;
        this.retry = retry;
        this.scope = scope;
        this.status = status;
        this.method = method;
        this.url = url;
        this.message = message;
    }
}
