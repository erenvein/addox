import type { RequestMethods } from '../../../index';

export class DiscordAPIError extends Error {
    public status: number;
    public code: number;
    public method: RequestMethods;
    public url: string;
    public override message: string;
    public body: {
        files: any;
        json: any;
    };

    public constructor(
        status: number,
        code: number,
        method: RequestMethods,
        url: string,
        message: string,
        data: any
    ) {
        super(message);

        this.status = status;
        this.code = code;
        this.method = method;
        this.url = url;
        this.message = message;
        this.body = {
            files: data.files,
            json: data.body,
        };
    }
}
