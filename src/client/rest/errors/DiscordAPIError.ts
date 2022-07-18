export class DiscordAPIError extends Error {
    public status: number;
    public code: number;
    public method: string;
    public url: string;
    public message: string;
    
    public constructor(status: number, code: number, method: string, url: string, message: string) {
        super(message);

        this.status = status;
        this.code = code;
        this.method = method;
        this.url = url;
        this.message = message;
    }
}
