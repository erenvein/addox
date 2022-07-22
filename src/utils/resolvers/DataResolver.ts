import { readFile } from 'node:fs/promises';
import fetch from 'node-fetch';

export const HttpPattern = /^https?:\/\//;

export async function resolveFile(filePathOrUrl: string) {
    if (HttpPattern.test(filePathOrUrl)) {
        return await fetch(filePathOrUrl).then(res => res.buffer());
    } else {
        return await readFile(filePathOrUrl);
    }
}


export async function resolveImage(data: Buffer | string): Promise<string> {
    if (Buffer.isBuffer(data)) {
        return `data:image/jpg;base64,${data.toString('base64')}`;
    } else {
        return resolveImage(await resolveFile(data));
    }
}
