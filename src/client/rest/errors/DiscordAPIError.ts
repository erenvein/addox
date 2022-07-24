import type { RequestMethods } from '../../../index';

export class DiscordAPIError extends Error {
    public status: number;
    public code: number;
    public method: RequestMethods;
    public url: string;
    public override message: string;

    public constructor(
        status: number,
        code: number,
        method: RequestMethods,
        url: string,
        message: string
    ) {
        super(message);

        this.status = status;
        this.code = code;
        this.method = method;
        this.url = url;
        this.message = message;
    }
}
