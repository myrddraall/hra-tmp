import { MPQArchive } from '@heroesbrowser/mpq';
import { FilteredEvents, IHeroProtocol, IReplayDetails, IReplayGameEvent, IReplayHeader, IReplayInitData, IReplayMessageEvent, IReplayTrackerEvent } from 'heroesprotocol-data';
import { HeroProtocolLoader } from 'heroesprotocol-loader';
import { Observable, Subject } from 'rxjs';
import { IProgressEvent } from './ProgressEvent';
import { Buffer } from 'buffer';

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

enum ReplayFiles {
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

export class ReplayData {
    private _progress: Subject<IProgressEvent> = new Subject();
    private _mpq: MPQArchive;
    private _data: ArrayBuffer;
    private _protocol: IHeroProtocol;
    private _loaded: Promise<void>;
    private _header: IReplayHeader;
    private _details: IReplayDetails;
    private _initData: IReplayInitData;
    private _attributeEvents: IReplayDetails;
    private _gameEvents: IReplayGameEvent[];
    private _messageEvents: IReplayMessageEvent[];
    private _trackerEvents: IReplayTrackerEvent[];
    constructor(private file: File) {
    }
    public get progress(): Observable<IProgressEvent> {
        return this._progress;
    }
    public get header(): Promise<IReplayHeader> {
        return (async () => {
            await this.load();
            return this._header;
        })();
    }
    public get details(): Promise<IReplayDetails> {
        return (async () => {
            await this.load();
            return this._details;
        })();
    }
    public get initData(): Promise<IReplayInitData> {
        return (async () => {
            await this.load();
            return this._initData;
        })();
    }
    public get attributeEvents(): Promise<IReplayDetails> {
        return (async () => {
            await this.load();
            return this._attributeEvents;
        })();
    }
    public get gameEvents(): Promise<IReplayGameEvent[]> {
        return (async () => {
            await this.load();
            return this._gameEvents;
        })();
    }
    public get messageEvents(): Promise<IReplayMessageEvent[]> {
        return (async () => {
            await this.load();
            return this._messageEvents;
        })();
    }
    public get trackerEvents(): Promise<IReplayTrackerEvent[]> {
        return (async () => {
            await this.load();
            return this._trackerEvents;
        })();
    }
    public load(): Promise<void> {
        if (this._loaded) {
            return this._loaded;
        }
        this._loaded = new Promise(async (res, rej) => {
            const progress: IProgressEvent = {
                currentStep: {
                    name: `Loading`,
                    description: 'Loading replay file ' + this.file.name,
                    loaded: 0,
                    total: -1
                },
                overall: {
                    name: 'Loading',
                    description: 'Loading replay file ' + this.file.name,
                    loaded: 0,
                    total: 9
                }
            };
            this._progress.next(progress);
            const startTime = new Date().getTime();
            await this.loadFromFile();
            progress.currentStep.name = 'Protocol';
            progress.currentStep.description = 'Loading replay protocol';
            progress.overall.loaded++;
            this._progress.next(progress);
            const protocol = await this.loadProtocol();
            progress.currentStep.name = 'Parse';
            progress.currentStep.description = 'Parsing replay';
            progress.overall.loaded++;
            this._progress.next(progress);
            const sub = protocol.progress.subscribe(_ => {
                progress.currentStep.name = _.file;
                progress.currentStep.loaded = _.current;
                progress.currentStep.total = _.total;
                this._progress.next(progress);
            });
            await this.parseHeader();
            progress.currentStep.loaded = progress.currentStep.total;
            progress.overall.loaded++;
            this._progress.next(progress);
            await this.parseInitData();
            progress.currentStep.loaded = progress.currentStep.total;
            progress.overall.loaded++;
            this._progress.next(progress);
            await this.parseDetails();
            progress.currentStep.loaded = progress.currentStep.total;
            progress.overall.loaded++;
            this._progress.next(progress);
            await this.parseAttributeEvents();
            progress.currentStep.loaded = progress.currentStep.total;
            progress.overall.loaded++;
            this._progress.next(progress);
            await this.parseTrackerEvents();
            progress.currentStep.loaded = progress.currentStep.total;
            progress.overall.loaded++;
            this._progress.next(progress);
            await this.parseMessageEvents();
            progress.currentStep.loaded = progress.currentStep.total;
            progress.overall.loaded++;
            this._progress.next(progress);
            await this.parseGameEvents();
            progress.currentStep.loaded = progress.currentStep.total;
            progress.overall.loaded++;
            this._progress.next(progress);
            console.log("Replay init took ", (new Date().getTime() - startTime), 'ms');
            sub.unsubscribe();
            res();
        });
        return this._loaded;
    }
    private async loadProtocol(): Promise<IHeroProtocol> {
        if (!this._protocol) {
            this._data = await this.loadFromFile();
            this._mpq = new MPQArchive(this._data);
            const baseProtocol = await HeroProtocolLoader.getProtocol();
            const baseHeader = parseStrings(baseProtocol.decodeReplayHeader(this._mpq.header.userDataHeader.content)) as IReplayHeader;
            this._protocol = await HeroProtocolLoader.getProtocol(baseHeader.m_version.m_baseBuild);
        }
        return this._protocol;
    }
    private async parseHeader() {
        if (!this._header) {
            const protocol = await this.loadProtocol();
            this._header = parseStrings(protocol.decodeReplayHeader(this._mpq.header.userDataHeader.content)) as IReplayHeader;
        }
        console.log('parseHeader', this._header);
        return this._header;
    }
    private async parseDetails(): Promise<IReplayDetails> {
        if (!this._details) {
            this._details = await this.parseMpqData<IReplayDetails>(ReplayFiles.DETAILS);
        }
        console.log('parseDetails', this._details);
        return this._details;
    }
    private async parseInitData(): Promise<IReplayInitData> {
        if (!this._initData) {
            this._initData = await this.parseMpqData<IReplayInitData>(ReplayFiles.INITDATA);
        }
        console.log('parseInitData', this._initData);
        return this._initData;
    }
    private async parseAttributeEvents(): Promise<IReplayDetails> {
        if (!this._attributeEvents) {
            this._attributeEvents = await this.parseMpqData<IReplayDetails>(ReplayFiles.ATTRIBUTES_EVENTS);
        }
        console.log('parseAttributeEvents', this._attributeEvents);
        return this._attributeEvents;
    }
    private async parseGameEvents(): Promise<IReplayGameEvent[]> {
        if (!this._gameEvents) {
            this._gameEvents = await this.parseMpqEvents<IReplayGameEvent>(ReplayFiles.GAME_EVENTS);
        }
        console.log('parseGameEvents', this._gameEvents);
        return this._gameEvents;
    }
    private async parseMessageEvents(): Promise<IReplayMessageEvent[]> {
        if (!this._messageEvents) {
            this._messageEvents = await this.parseMpqEvents<IReplayMessageEvent>(ReplayFiles.MESSAGE_EVENTS);
        }
        console.log('parseMessageEvents', this._messageEvents);
        return this._messageEvents;
    }
    private async parseTrackerEvents(): Promise<IReplayTrackerEvent[]> {
        if (!this._trackerEvents) {
            this._trackerEvents = await this.parseMpqEvents<IReplayTrackerEvent>(ReplayFiles.TRACKER_EVENTS);
        }
        console.log('parseTrackerEvents', this._trackerEvents);
        return this._trackerEvents;
    }
    private async parseMpqData<T>(file: ReplayFiles): Promise<T> {
        const protocol = await this.loadProtocol();
        return parseStrings(protocol[decoderMap[file]](this._mpq.readFile(file))) as T;
    }
    private async parseMpqEvents<T>(file: ReplayFiles): Promise<T[]> {
        const protocol = await this.loadProtocol();
        const eventGen = protocol[decoderMap[file]](this._mpq.readFile(file));
        const events: T[] = [];
        for (const event of eventGen) {
            if (FilteredEvents.indexOf(event._event) === -1) {
                events.push(parseStrings(event));
            }
        }
        return events;
    }

    private loadFromFile(): Promise<ArrayBuffer> {
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
