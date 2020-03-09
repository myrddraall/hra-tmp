
import { WebWorker, RunOnWorker } from 'angular-worker-proxy';
import { Subject, Observable } from 'rxjs';
import { IProgressEvent } from './ProgressEvent';
import { MPQArchive } from '@heroesbrowser/mpq';
import { HeroProtocolLoader } from 'heroesprotocol-loader';
import { Buffer } from 'buffer';
import { IReplayHeader, IReplayDetails, IHeroProtocol, IReplayInitData } from 'heroesprotocol-data';
import { PlayerInfoParser } from './parsers';


interface Defer<T> extends Promise<T> {
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

function parseStrings<T>(data) {
    if (!data) {
        return data;
    } else if (data instanceof Buffer) {
        return data.toString();
    } else if (Array.isArray(data)) {
        return data.map(item => parseStrings(item));
    } else if (typeof data === 'object') {
        // tslint:disable-next-line:forin
        for (const key in data) {
            data[key] = parseStrings(data[key]);
        }
    }
    return data;
};

export enum ReplayFiles {
    DETAILS = 'replay.details',
    INITDATA = 'replay.initdata',
    GAME_EVENTS = 'replay.game.events',
    MESSAGE_EVENTS = 'replay.message.events',
    TRACKER_EVENTS = 'replay.tracker.events',
    ATTRIBUTES_EVENTS = 'replay.attributes.events',
}

const decoderMap = {
    [ReplayFiles.DETAILS]: 'decodeReplayDetails',
    [ReplayFiles.INITDATA]: 'decodeReplayInitdata',
    [ReplayFiles.GAME_EVENTS]: 'decodeReplayGameEvents',
    [ReplayFiles.MESSAGE_EVENTS]: 'decodeReplayMessageEvents',
    [ReplayFiles.TRACKER_EVENTS]: 'decodeReplayTrackerEvents',
    [ReplayFiles.ATTRIBUTES_EVENTS]: 'decodeReplayAttributesEvents',
};

@WebWorker('HotsReplay')
export class Replay {
    private _progress: Subject<IProgressEvent> = new Subject();
    private _mpq: MPQArchive;
    private _replayData: ArrayBuffer;
    private _protocol: Defer<IHeroProtocol>;

    private _header: Defer<IReplayHeader>;
    private _details: Defer<IReplayDetails>;
    private _initData: Defer<IReplayInitData>;
    private _attributeEvents: Defer<IReplayDetails>;

    constructor(private file?: any) {
        /*setInterval(()=>{
             this._progress.next({} as any)
        }, 1000)*/

    }




    @RunOnWorker()
    public get progress(): Observable<IProgressEvent> {
        return this._progress;
    }

    @RunOnWorker()
    public async init(): Promise<void> {
        this._replayData = await this.loadReplayData();
        await this.initializeMatchData();


    }

    private async initializeMatchData(): Promise<void> {
        await this.parseHeader();
        const pInfo = new PlayerInfoParser(this).parse();
        console.log('---------', pInfo);

    }

    private get protocol(): Promise<IHeroProtocol> {
        this.parseHeader();
        return this._protocol;
    }
    private async parseHeader(): Promise<void> {
        if (!this._header) {
            this._header = this.createDefer();
            this._protocol = this.createDefer();
            const baseProtocol = await HeroProtocolLoader.getProtocol();
            this._mpq = new MPQArchive(this._replayData);
            const baseHeader = parseStrings(baseProtocol.decodeReplayHeader(this._mpq.header.userDataHeader.content)) as IReplayHeader;
            const protocol = await HeroProtocolLoader.getProtocol(baseHeader.m_version.m_baseBuild);
            const header = parseStrings(protocol.decodeReplayHeader(this._mpq.header.userDataHeader.content)) as IReplayHeader;
            this._protocol.resolve(protocol);
            this._header.resolve(header);
        }
    }

    public get header(): Promise<IReplayHeader> {
        this.parseHeader();
        return this._header;
    }

    private async parseDetails(): Promise<void> {
        if (!this._details) {
            this._details = this.createDefer();
            const data = await this.parseMpQFile<IReplayDetails>(ReplayFiles.DETAILS);
            this._details.resolve(data);
        }
    }

    public get details(): Promise<IReplayDetails> {
        this.parseDetails();
        return this._details;
    }

    private async parseInitData(): Promise<void> {
        if (!this._initData) {
            this._initData = this.createDefer();
            const data = await this.parseMpQFile<IReplayInitData>(ReplayFiles.INITDATA);
            this._initData.resolve(data);
        }
    }

    public get initData(): Promise<IReplayInitData> {
        this.parseInitData();
        return this._initData;
    }

    private async parseAttributeEvents(): Promise<void> {
        console.log('22222222222222');
        if (!this._attributeEvents) {
            console.log('333333333333');
            this._attributeEvents = this.createDefer();
            console.log('444444444444444');
            const data = await this.parseMpQFile<IReplayDetails>(ReplayFiles.ATTRIBUTES_EVENTS);
            console.log('&&&&&&&&&&&', data);
            this._attributeEvents.resolve(data);
        }
    }

    public get attributeEvents(): Promise<IReplayDetails> {
        console.log('111111111111111111111111111111111');
        this.parseAttributeEvents();
        return this._attributeEvents;
    }


    private async parseMpQFile<T>(file: ReplayFiles): Promise<T> {
        const protocol = await this.protocol;
        return parseStrings(protocol[decoderMap[file]](this._mpq.readFile(file))) as T;
    }

    private createDefer<T>(): Defer<T> {
        const d = {
            promise: undefined,
            resolve: undefined,
            reject: undefined
        };

        const p: Defer<T> = new Promise((res, rej) => {
            d.resolve = res;
            d.reject = rej;
        }) as Defer<T>;
        p.reject = d.reject;
        p.resolve = d.resolve;
        console.log(p);
        return p;
    }

    private loadReplayData(): Promise<ArrayBuffer> {
        return new Promise((res, rej) => {
            const progress: IProgressEvent = {
                currentStep: {
                    name: `Loading`,
                    description: this.file.name,
                    loaded: -1,
                    total: 1
                },
                overall: {
                    name: 'Loading Replay',
                    description: 'Loading Replay',
                    loaded: -1,
                    total: 5
                }
            };
            this._progress.next(progress);
            if (this.file) {
                var reader: FileReader = new FileReader();
                reader.onloadstart = (evt: ProgressEvent) => {
                    progress.currentStep.loaded = evt.loaded;
                    progress.currentStep.total = evt.total;
                    progress.overall.loaded = 0;
                    this._progress.next(progress);
                };

                reader.onload = (evt: ProgressEvent) => {
                    progress.currentStep.loaded = evt.total;
                    progress.currentStep.total = evt.total;
                    progress.overall.loaded = 1;
                    this._progress.next(progress);
                };

                reader.onloadend = (evt: ProgressEvent) => {
                    res(reader.result as ArrayBuffer);
                };

                reader.onprogress = (evt: ProgressEvent) => {
                    progress.currentStep.loaded = evt.loaded;
                    progress.currentStep.total = evt.total;
                    this._progress.next(progress);
                };

                reader.onabort = (evt: ProgressEvent) => {
                    progress.currentStep.loaded = -1;
                    progress.currentStep.total = -1;
                    progress.overall.loaded = 1;
                    this._progress.next(progress);
                    rej();
                };

                reader.onerror = (evt: ProgressEvent) => {
                    progress.currentStep.loaded = -1;
                    progress.currentStep.total = -1;
                    progress.overall.loaded = 1;
                    this._progress.next(progress);
                    rej(evt.returnValue);
                };
                reader.readAsArrayBuffer(this.file);
            }
        });
    }


}
