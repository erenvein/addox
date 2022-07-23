import { readFile } from 'node:fs/promises';
import { parse, resolve } from 'node:path';
import fetch from 'node-fetch';
import { fromBuffer } from 'file-type';
import type { ImageMimes, FileData } from '../..';

export const HttpPattern = /^(https?)?:\/\//;

export const ImageMimesArray = ['image/png', 'image/jpeg', 'image/gif'] as const;

export async function resolveFile(filePathOrUrlOrBuffer: string | Buffer): Promise<FileData> {
    if (Buffer.isBuffer(filePathOrUrlOrBuffer)) {
        const resolved = await fromBuffer(filePathOrUrlOrBuffer);

        return {
            data: filePathOrUrlOrBuffer,
            type: resolved?.mime ?? 'image/jpeg',
            name: `file.${resolved?.ext}`,
        };
    } else if (HttpPattern.test(filePathOrUrlOrBuffer)) {
        const response = await fetch(filePathOrUrlOrBuffer);
        const buffer = Buffer.from(await response.arrayBuffer());

        return {
            data: buffer,
            type:
                response.headers.get('content-type') ??
                (await fromBuffer(buffer))?.mime ??
                'image/jpeg',
            name: parse(filePathOrUrlOrBuffer).base,
        };
    } else {
        const buffer = await readFile(resolve(filePathOrUrlOrBuffer));
        return {
            data: buffer,
            type: (await fromBuffer(buffer))?.mime ?? 'image/jpeg',
            name: parse(filePathOrUrlOrBuffer).base,
        };
    }
}

export async function resolveImage(data: Buffer | string, type: ImageMimes): Promise<string> {
    if (Buffer.isBuffer(data)) {
        return `data:${type};base64,${data.toString('base64')}`;
    } else {
        const resolved = await resolveFile(data);
        if (!ImageMimesArray.includes(resolved.type as ImageMimes)) type = 'image/jpeg';

        return await resolveImage(resolved.data as string, resolved.type as ImageMimes);
    }
}
