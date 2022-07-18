export class HTTPError extends Error {
    public constructor(status: number, method: string, url: string, message: string) {
        super(message);
    }
}
