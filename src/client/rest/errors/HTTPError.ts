export class HTTPError extends Error {
    public status: number;
    public method: string;
    public url: string;
    public message: string;

    public constructor(status: number, method: string, url: string, message: string) {
        super(message);

        this.status = status;
        this.method = method;
        this.url = url;
        this.message = message;
    }
}
