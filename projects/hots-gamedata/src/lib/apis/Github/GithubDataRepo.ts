import { GitHubApi } from "./Github.api";
import {SemVer} from 'semver';
export class GitHubDataRepo {
    protected githubApi:GitHubApi;
    protected version:SemVer;
    constructor(user: string, repo: string, targetGameVersion?:string){
        this.version = new SemVer(targetGameVersion);
        this.githubApi = new GitHubApi(user, repo);

    }
}