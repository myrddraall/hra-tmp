import { IReplayVersion } from './protocol/header-data/IReplayVersion';


export class GameVersion {
    _major: number;
    _minor: number;
    _patch: number;
    _build: number;
    _baseBuild: number;
    _ptr: boolean;
    constructor(version: string);
    constructor(major: number, minor: number, patch: number, build: number, baseBuild: number, ptr?: boolean);
    constructor(replayVersion: IReplayVersion, ptr?: boolean);
    constructor(...args: any[]) {
        if (args.length === 1 && typeof args[0] === 'string') {
            this.parseVersion(args[0]);
        } else if ((args.length === 1 || args.length === 2) && typeof args[0] === 'object') {
            const rv = args[0] as IReplayVersion;
            this._major = rv.m_major;
            this._minor = rv.m_minor;
            this._patch = rv.m_revision;
            this._build = rv.m_build;
            this._baseBuild = rv.m_baseBuild;
            this._ptr = args[1] || false;
        } else {
            this._major = args[0];
            this._minor = args[1];
            this._patch = args[2];
            this._build = args[3];
            this._baseBuild = args[4];
            this._ptr = args[5] || false;
        }
    }

    private parseVersion(versionStr: string): void {
        if (versionStr.charAt(0).toLowerCase() === 'v') {
            versionStr = versionStr.substr(1);
        }
        let parts: string[] = versionStr.split('_');
        if (parts.length === 2) {
            this._ptr = true;
        }
        parts = parts[0].split('.');

        this._major = +parts[0];
        this._minor = +parts[1];
        this._patch = +parts[2];
        this._build = +parts[3];
        this._baseBuild = parts.length === 5 ? +parts[4] : this._build;
    }

    public get major(): number {
        return this._major;
    }
    public get minor(): number {
        return this._minor;
    }
    public get patch(): number {
        return this._patch;
    }
    public get build(): number {
        return this._build;
    }
    public get baseBuild(): number {
        return this._baseBuild;
    }
    public get ptr(): boolean {
        return this._ptr;
    }

    public toString(): string {
        return `${this._major}.${this._minor}.${this._patch}.${this._build}` + (this._ptr ? '_ptr' : '');
    }
}