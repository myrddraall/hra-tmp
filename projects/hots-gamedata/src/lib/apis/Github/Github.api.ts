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

    constructor(
        private readonly user: string,
        private readonly repo: string,
    ) {

    }

    private get apiBaseUrl(): string {
        return `${this.apiBaseURL}/${this.user}/${this.repo}`;
    }

    public async listTags(): Promise<string[]> {
        const tags:{name:string}[] = await this.callApi(`${this.apiBaseUrl}/tags`);
        return linq.from(tags).select(_ => _.name).toArray();
    }

    public async listBranches(): Promise<string[]> {
        const branches:{name:string}[] = await this.callApi(`${this.apiBaseUrl}/branches`);
        return linq.from(branches).select(_ => _.name).toArray();
    }

    public ls(path:string, ref:string = 'master'):Promise<GitTreeEntry[]>{
        return this.callApi(`${this.apiBaseUrl}/contents/${path}?ref=${ref}`);
    }

/*
    public async getTagByName(tagName: string) {
        const tags = await this.listTags();
        const tagItem = linq.from(tags)
            .where(_ => _.name === tagName)
            .first();
        return await this.callApi(tagItem.commit.url);
    }
    public async getTagSha(tagName: string): Promise<string> {
        const tags = await this.listTags();
        return linq.from(tags)
            .where(_ => _.name === tagName)
            .select(_ => _.commit.sha as string)
            .first();
    }

    public async getTagList(path:string = '', ref:string = 'master'){
      
        return this.callApi(`${this.apiBaseUrl}/contents/${path}?ref=${ref}`);

    }


    public async listBranches(): Promise<any> {
        return this.callApi(`${this.apiBaseUrl}/branches`);
    }
    public async getBranch(branch: string): Promise<any> {
        return this.callApi(`${this.apiBaseUrl}/branches/${branch}`);
    }

    public async listFiles(path: string = '', tag?: string): Promise<any> {
        /*const response = await fetch(`${this.apiBaseURL}/${path}`);
        if (response.ok) {
            return await response.json();
        }
        return this.callApi('https://api.github.com/repos/HeroesToolChest/heroes-data/branches/master');
    }*/

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
            console.log('^^^^^^^^^^^^^^^^^^')
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