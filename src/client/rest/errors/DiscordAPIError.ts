export class DiscordAPIError extends Error {
    public constructor(status: number, code: number, method: string, url: string, message: string) {
        super(message);
    }
}
