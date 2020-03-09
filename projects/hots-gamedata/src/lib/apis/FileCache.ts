import { get, set } from 'idb-keyval';

const FileCacheKey = '__fileCache__';
const FileCachDataKey = `${FileCacheKey}.data.`;
const FileCachETagKey = `${FileCacheKey}.etag.`;


export class FileCache {

    public static getFile(url: string): Promise<string> {
        return get(FileCachDataKey + url);
    }
    public static getFileEtag(url: string):  Promise<string> {
        return get(FileCachETagKey + url);
    }

    public static async storeFile(url: string, etag:string, fileData:string): Promise<void> {
        await set(FileCachDataKey + url, fileData);
        await set(FileCachETagKey + url, etag);
    }
}