import type { RequestMethods } from '../../../index';

export class HTTPError extends Error {
    public status: number;
    public method: RequestMethods;
    public url: string;
    public override message: string;
    public body: {
        files: any;
        json: any;
    };

    public constructor(
        status: number,
        method: RequestMethods,
        url: string,
        message: string,
        data: any
    ) {
        super(message);

        this.status = status;
        this.method = method;
        this.url = url;
        this.message = message;
        this.body = {
            files: data.files,
            json: JSON.parse(data.body),
        };
    }
}
