import { FileCache } from '../FileCache';
import * as linq from 'linq';

export interface GitTreeEntry {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;

}

export class GitHubApi {
    private apiBaseURL: string = 'https://api.github.com/repos';
    private fileBaseURL: string = 'https://raw.githubusercontent.com';
    constructor(
        private readonly user: string,
        private readonly repo: string,
    ) {

    }

    private get apiBaseUrl(): string {
        return `${this.apiBaseURL}/${this.user}/${this.repo}`;
    }

    private get fileBaseUrl(): string {
        return `${this.fileBaseURL}/${this.user}/${this.repo}`;
    }

    public async listTags(): Promise<string[]> {
        const tags: { name: string }[] = await this.callApi(`${this.apiBaseUrl}/tags`);
        return linq.from(tags).select(_ => _.name).toArray();
    }

    public async listBranches(): Promise<string[]> {
        const branches: { name: string }[] = await this.callApi(`${this.apiBaseUrl}/branches`);
        return linq.from(branches).select(_ => _.name).toArray();
    }

    public ls(path: string, ref: string = 'master'): Promise<GitTreeEntry[]> {
        return this.callApi(`${this.apiBaseUrl}/contents/${path}?ref=${ref}`);
    }

    public async read(path: string, ref: string = 'master'): Promise<string> {
        const response = await this.readFile(path, ref);
        if (response.ok) {
            return await response.text();
        }
    }

    public async readJson(path: string, ref: string = 'master'): Promise<any> {
        const response = await this.readFile(path, ref);
        if (response.ok) {
            return await response.json();
        }
    }

    private async readFile(path: string, ref: string = 'master'): Promise<Response> {
        return await fetch(`${this.fileBaseUrl}/${ref}/${path}`);
    }

    private async callApi<T>(url: string): Promise<T> {
        const headers: any = {};
        const fileTime = await FileCache.getFileEtag(url);
        if (fileTime) {
            headers['If-None-Match'] = fileTime;
        }
        const response = await fetch(url, {
            headers
        });
        if (response.ok) {
            const rText = await response.text();
            FileCache.storeFile(url, response.headers.get('etag'), rText);
            return JSON.parse(rText);
        } else if (response.status === 304) {
            const rText = await FileCache.getFile(url);
            return JSON.parse(rText);
        }
        return null;

    }
}
