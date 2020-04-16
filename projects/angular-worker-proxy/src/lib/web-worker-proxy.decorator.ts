import "reflect-metadata";
import { Observable, Subject, Subscriber, Unsubscribable } from 'rxjs';
import { filter, first, share } from 'rxjs/operators';
import { ENVIRONMENT_IS_WEB, ENVIRONMENT_IS_WORKER } from './env';
import { isWebworkerGetPropertyCall, IWebworkerGetPropertyCall } from './messages/IWebworkerGetPropertyCall';
import { isWebworkerGetPropertyResponse, IWebworkerGetPropertyResponse } from './messages/IWebworkerGetPropertyResponse';
import { isWebworkerInitMessage, IWebworkerInitMessage } from './messages/IWebworkerInitMessage';
import { IWebworkerMemberMessage } from './messages/IWebworkerMemberMessage';
import { isWebworkerMessage, IWebworkerMessage } from './messages/IWebworkerMessage';
import { isWebworkerMethodCall, IWebworkerMethodCall } from './messages/IWebworkerMethodCall';
import { isWebworkerMethodCallResponse, IWebworkerMethodCallResponse } from './messages/IWebworkerMethodCallResponse';
import { isWebworkerNextValue, IWebworkerNextValue } from './messages/IWebworkerNextValue';
import { isWebworkerSetProperyCall, IWebworkerSetProperyCall } from './messages/IWebworkerSetProperyCall';
import { isWebworkerSubscribeCall, IWebworkerSubscribeCall } from './messages/IWebworkerSubscribeCall';
import { isWebworkerSubscriptionComplete, IWebworkerSubscriptionComplete } from './messages/IWebworkerSubscriptionComplete';
import { isWebworkerSubscriptionError, IWebworkerSubscriptionError } from './messages/IWebworkerSubscriptionError';
import { isWebworkerUnsubscribeCall, IWebworkerUnsubscribeCall } from './messages/IWebworkerUnsubscribeCall';
import { MessageType } from './messages/MessageType';
import { Type } from './Type';
import { WebWorkerService } from './web-worker.service';
declare function postMessage(message: any, transfer: Transferable[]): void;
declare function postMessage(message: any, options?: PostMessageOptions): void;

export const REMOTE_TARGET_KEY = '__webworker__.targetKey';



export interface IWebworkerRelay {
    readonly nextMessageId: number;
    readonly incommingMessages: Subject<IWebworkerMessage>;
    postMessage(msg: IWebworkerMessage, transfer?: Transferable[]): void;
    postPromiseMethodCall(memberId: number, args: any[], transfer?: Transferable[]): Promise<any>;
    postObservableMethodCall(memberId: number, args: any[], transfer?: Transferable[]): Observable<any>;
    postPromiseFieldGet(memberId: number): Promise<any>;
    postPromiseFieldSet(memberId: number): Promise<void>
    postObservableFieldGet(memberId: number): Observable<any>;
    postObservableFieldSet(memberId: number): Promise<void>

    initializeAsHost(msg: IWebworkerInitMessage): void;
    addProxy(remoteId: number, proxy: IWebworkerRelay): void;
    dispose(): void
}

export interface IWebworkerRelayInternal extends IWebworkerRelay {
    prepareMessage(msg: IWebworkerMessage): void;
    postMessageInternal(msg: IWebworkerMessage, transfer?: Transferable[]): void;
    parentProxy: IWebworkerRelayInternal;
    readonly targetPath: Array<string | number>;
    readonly initialized: Promise<void>;
    worker: Worker;
    sendQueue: () => void;
}

function createWebWorkerRelay<T>(ofType: Type<T>): Type<IWebworkerRelayInternal> {
    return class WebWorkerRelay extends (ofType as Type) implements IWebworkerRelayInternal {
        public worker: Worker;

        private _incommingMessages: Subject<IWebworkerMessage>;

        private _nextMessageId: number = 0;
        private _parent: IWebworkerRelayInternal = null;
        private _remoteId: number;
        private _proxies: Map<number, WebWorkerRelay>;
        private _msgSub: Unsubscribable;
        public _initialized: Promise<void>;
        private _remoteSubs: Map<string, Unsubscribable> = new Map();

        public get initialized(): Promise<void> {
            if (!this.parentProxy) {
                return this._initialized;
            }
            return this.parentProxy.initialized;
        }
        private _initHost: () => void;

        constructor(...args: any) {
            super(...args);
            WebWorkerService.registerTarget(this);
            this._initialized = new Promise(res => {
                this._initHost = res;
            });
        }
        public get nextMessageId(): number {
            return this._nextMessageId++;
        }

        public get incommingMessages(): Subject<IWebworkerMessage> {
            if (this.parentProxy) {
                return this.parentProxy.incommingMessages;
            }
            return this._incommingMessages;
        }
        /*
                public getTargetName(): string {
                    return getRemoteClassIdentifier(this);
                }
                public getTargetId(): string {
                    return `${this.getTargetName()}__${this.getInstanceId()}`;
                }
        
                public getInstanceId(): number {
                    if (!this.___instanceId) {
                        this.___instanceId = WebWorkerRelay.instanceCount++;
                    }
                    return this.___instanceId;
        
                }
                */

        public set parentProxy(value: IWebworkerRelayInternal) {
            this._parent = value;
            this.initListener();
        }

        public initListener() {
            if (this._msgSub) {
                this._msgSub.unsubscribe()
                this._msgSub = null;
            }
            if (this.incommingMessages) {
                this._msgSub = this.incommingMessages.subscribe((msg) => {
                    this.procressIncomingMessage(msg);
                });
                this._proxies?.forEach(_ => _.initListener());
            }
        }
        public get parentProxy(): IWebworkerRelayInternal {
            return this._parent;
        }

        public get targetPath(): Array<string | number> {

            if (!this.parentProxy) {
                return [getRemoteClassIdentifier(this)];
            }

            const tp = this.parentProxy.targetPath;
            return [...tp, this._remoteId];
        }

        public prepareMessage(msg: IWebworkerMessage): void {
            if (msg.messageId === undefined) {
                msg.messageId = this.nextMessageId;
            }
            //msg.target = getRemoteClassIdentifier(this);
        }

        public postMessage(msg: IWebworkerMessage<any>, transfer?: Transferable[]): void {
            this.queueMessage(() => {
                this.prepareMessage(msg);
                this.postMessageInternal(msg, transfer);
            });
            console.log('postMessage', this._queuedMessages, this)
        }

        private _queuedMessages: Array<() => void> = [];

        private queueMessage(sendFn: () => void): void {
            if (this._queuedMessages) {
                this._queuedMessages.push(sendFn);
            } else {
                sendFn();
            }
        }

        public dispose() {
            this._proxies.forEach(proxy => {
                proxy.dispose();
            });
            if (typeof super.dispose === 'function') {
                super.dispose();
            }
        }

        public sendQueue() {
            if (this._queuedMessages) {
                const msgs = this._queuedMessages;
                this._queuedMessages = undefined;
                for (const sender of msgs) {
                    sender();
                }
            }
        }

        public postMessageInternal(msg: IWebworkerMessage<any>, transfer?: Transferable[]): void {
            throw new Error("Method not implemented.");
        }

        public async postPromiseMethodCall(memberId: number, args: any[], transfer?: Transferable[]): Promise<any> {
            await this.initialized;
            const msg: IWebworkerMethodCall = {
                messageId: this.nextMessageId,
                memberId: memberId,
                target: this.targetPath,
                type: MessageType.METHOD_CALL,
                data: args
            };
            const response = this.getNextIncommingMessage<IWebworkerMethodCallResponse>(_ => isWebworkerMethodCallResponse(_) && _.messageId === msg.messageId);
            this.postMessage(msg);
            return (await response).data;
        }

        public postObservableMethodCall(memberId: number, args: any[], transfer?: Transferable[]): Observable<any> {
            return Observable.create((sub: Subscriber<any>) => {
                let unsub: Unsubscribable;
                const msg: IWebworkerSubscribeCall = {
                    messageId: this.nextMessageId,
                    memberId: memberId,
                    target: this.targetPath,
                    type: MessageType.SUBSCRIBE,
                    data: args
                };
                (async () => {
                    await this.initialized;
                    unsub = this.incommingMessages.pipe(filter(_ =>
                        (isWebworkerNextValue(_) || isWebworkerSubscriptionComplete(_) || isWebworkerSubscriptionError(_))
                        && _.messageId === msg.messageId)
                    ).subscribe(msg => {
                        if (isWebworkerNextValue(msg)) {
                            sub.next(msg.data);
                        } else if (isWebworkerSubscriptionComplete(msg)) {
                            sub.complete();
                        } else {
                            sub.error(msg.data);
                        }
                    });
                    this.postMessage(msg);
                })();
                return () => {
                    unsub?.unsubscribe();
                    const unmsg: IWebworkerUnsubscribeCall = {
                        messageId: msg.messageId,
                        memberId: msg.memberId,
                        target: msg.target,
                        type: MessageType.UNSUBSCRIBE
                    };
                    this.postMessage(unmsg);
                };
            }).pipe(share());
        }

        public async postPromiseFieldGet(memberId: number): Promise<any> {
            await this.initialized;
            const msg: IWebworkerGetPropertyCall = {
                messageId: this.nextMessageId,
                memberId: memberId,
                target: this.targetPath,
                type: MessageType.FIELD_GET
            };

            const response = this.getNextIncommingMessage<IWebworkerMethodCallResponse>(_ => {
                return isWebworkerGetPropertyResponse(_) && _.messageId === msg.messageId
            });

            this.postMessage(msg);
            return (await response).data;
        }

        public async postPromiseFieldSet(memberId: number): Promise<void> {
            await this.initialized;
            const msg: IWebworkerSetProperyCall = {
                messageId: this.nextMessageId,
                memberId: memberId,
                target: this.targetPath,
                type: MessageType.FIELD_SET
            };
            this.postMessage(msg);
        }

        public postObservableFieldGet(memberId: number): Observable<any> {
            return Observable.create((sub: Subscriber<any>) => {
                let unsub: Unsubscribable;
                const msg: IWebworkerSubscribeCall = {
                    messageId: this.nextMessageId,
                    memberId: memberId,
                    target: this.targetPath,
                    type: MessageType.SUBSCRIBE
                };
                (async () => {
                    await this.initialized;
                    unsub = this.incommingMessages.pipe(filter(_ =>
                        (isWebworkerNextValue(_) || isWebworkerSubscriptionComplete(_) || isWebworkerSubscriptionError(_))
                        && _.messageId === msg.messageId)
                    ).subscribe(msg => {
                        if (isWebworkerNextValue(msg)) {
                            sub.next(msg.data);
                        } else if (isWebworkerSubscriptionComplete(msg)) {
                            sub.complete();
                        } else {
                            sub.error(msg.data);
                        }
                    });
                    this.postMessage(msg);
                })();
                return () => {
                    unsub?.unsubscribe();
                    const unmsg: IWebworkerUnsubscribeCall = {
                        messageId: msg.messageId,
                        memberId: msg.memberId,
                        target: msg.target,
                        type: MessageType.UNSUBSCRIBE
                    };
                    this.postMessage(unmsg);
                };
            }).pipe(share());
        }
        public postObservableFieldSet(memberId: number): Promise<void> {
            return null;
        }

        public initializeAsHost(msg: IWebworkerInitMessage): void {
            this._incommingMessages = new Subject();
            this.parentProxy = null;
            this._initHost();
        }

        public addProxy(remoteId: number, proxy: WebWorkerRelay): void {
            this.removeProxy(remoteId);
            proxy.setProxyParent(remoteId, this);
            if (!this._proxies) {
                this._proxies = new Map();
            }
            this._proxies.set(remoteId, proxy);

        }

        private removeProxy(remoteId: number): void {
            if (!this._proxies) return;
            const p = this._proxies.get(remoteId);
            if (p) {
                this._proxies.delete(remoteId);
                p.setProxyParent(remoteId, null);
            }
        }

        private setProxyParent(remoteId: number, proxy: WebWorkerRelay): void {
            if (proxy === null) {
                this.parentProxy = null;
                this._remoteId = null;
            } else {
                this._remoteId = remoteId;
                this.parentProxy = proxy;
            }
        }

        private getUnsubscribeKey(msg: IWebworkerMemberMessage): string {
            return msg.memberId + '|' + msg.messageId;
        }

        private getUnsubscribe(msg: IWebworkerMemberMessage): Unsubscribable {
            return this._remoteSubs.get(this.getUnsubscribeKey(msg));
        }

        private setUnsubscribe(msg: IWebworkerMemberMessage, value: Unsubscribable): void {
            this._remoteSubs.set(this.getUnsubscribeKey(msg), value);
        }

        private procressIncomingMessage(msg: IWebworkerMessage) {
            if (this.isTarget(msg.target)) {
                if (isWebworkerMethodCall(msg)) {
                    const retType = getReturnTypeInst(this, msg.memberId);
                    if (retType === Promise) {
                        this.processPromiseMethodCall(msg);
                    }
                } else if (isWebworkerGetPropertyCall(msg)) {
                    const retType = getReturnTypeInst(this, msg.memberId);
                    if (retType === Promise) {
                        this.processPromiseGet(msg);
                    }
                } else if (isWebworkerSetProperyCall(msg)) {
                    const retType = getReturnTypeInst(this, msg.memberId);
                    if (retType === Promise) {
                        this.processPromiseSet(msg);
                    }
                } else if (isWebworkerSubscribeCall(msg)) {
                    const retType = getReturnTypeInst(this, msg.memberId);
                    if (isOfType(retType, Observable)) {
                        if (!msg.data) {
                            this.processObservableGet(msg);
                        } else {
                            this.processObservableCall(msg);
                        }
                    }
                } else if (isWebworkerUnsubscribeCall(msg)) {
                    const retType = getReturnTypeInst(this, msg.memberId);
                    if (isOfType(retType, Observable)) {
                        this.processObservableUnsub(msg);
                    }
                }
            }
        }

        private isTarget(target: Array<string | number>): boolean {
            return this.targetPath.join('.') === target.join('.');
        }

        private async processPromiseMethodCall(msg: IWebworkerMethodCall) {
            const key = getPropertyKeyInst(this, msg.memberId);
            const result = await this[key].apply(this, msg.data);
            const resultMsg: IWebworkerMethodCallResponse = {
                messageId: msg.messageId,
                target: msg.target,
                type: MessageType.METHOD_RETURN,
                data: result
            };
            this.postMessage(resultMsg);
        }

        private async processPromiseGet(msg: IWebworkerGetPropertyCall) {
            const key = getPropertyKeyInst(this, msg.memberId);
            const result = await this[key];
            const resultMsg: IWebworkerGetPropertyResponse = {
                messageId: msg.messageId,
                target: msg.target,
                type: MessageType.FIELD_RETURN,
                data: result
            };
            this.postMessage(resultMsg);
        }

        private async processPromiseSet(msg: IWebworkerSetProperyCall) {

        }
        private async  processObservableCall(msg: IWebworkerSubscribeCall) {
            const key = getPropertyKeyInst(this, msg.memberId);
            const obs = this[key].apply(this, msg.data) as Observable<any>;

            const unsub = obs.subscribe(
                value => {
                    const nextMsg: IWebworkerNextValue = {
                        messageId: msg.messageId,
                        memberId: msg.memberId,
                        target: msg.target,
                        type: MessageType.NEXT,
                        data: value
                    };
                    this.postMessage(nextMsg);
                },
                err => {
                    const errMsg: IWebworkerSubscriptionError = {
                        messageId: msg.messageId,
                        memberId: msg.memberId,
                        target: msg.target,
                        type: MessageType.ERROR,
                        data: err
                    };
                    this.postMessage(errMsg);
                },
                () => {
                    const complateMsg: IWebworkerSubscriptionComplete = {
                        messageId: msg.messageId,
                        memberId: msg.memberId,
                        target: msg.target,
                        type: MessageType.COMPLETE
                    };
                    this.postMessage(complateMsg);
                }
            );
            this.setUnsubscribe(msg, unsub);
        }

        private async processObservableGet(msg: IWebworkerSubscribeCall) {
            const key = getPropertyKeyInst(this, msg.memberId);

            const obs = this[key] as Observable<any>;

            const unsub = obs.subscribe(
                value => {
                    const nextMsg: IWebworkerNextValue = {
                        messageId: msg.messageId,
                        memberId: msg.memberId,
                        target: msg.target,
                        type: MessageType.NEXT,
                        data: value
                    };
                    this.postMessage(nextMsg);
                },
                err => {
                    const errMsg: IWebworkerSubscriptionError = {
                        messageId: msg.messageId,
                        memberId: msg.memberId,
                        target: msg.target,
                        type: MessageType.ERROR,
                        data: err
                    };
                    this.postMessage(errMsg);
                },
                () => {
                    const complateMsg: IWebworkerSubscriptionComplete = {
                        messageId: msg.messageId,
                        memberId: msg.memberId,
                        target: msg.target,
                        type: MessageType.COMPLETE
                    };
                    this.postMessage(complateMsg);
                }
            );
            this.setUnsubscribe(msg, unsub);
        }

        private async processObservableUnsub(msg: IWebworkerUnsubscribeCall) {
            const key = getPropertyKeyInst(this, msg.memberId);
            this.getUnsubscribe(msg)?.unsubscribe();
            this.setUnsubscribe(msg, undefined);
        }

        protected async getNextIncommingMessage<T extends IWebworkerMessage>(predicate?: (msg: IWebworkerMessage) => boolean): Promise<T> {
            let msgs = this.incommingMessages as Observable<IWebworkerMessage>;
            if (predicate) {
                msgs = msgs.pipe(filter(predicate));
            }
            return await msgs.pipe(first()).toPromise() as T;
        }

    } as any;
}

function createMainSideRelay<T>(ofType: Type<T>, id: string): Type<IWebworkerRelay> {
    class MainSideRelay extends createWebWorkerRelay(ofType as Type) implements IWebworkerRelay {

        private isHost: boolean = false;
        private ctorArgs: any[];
        private workerInitialized: boolean = false;
        constructor(...args: any[]) {
            super(...args);
            this.ctorArgs = args;
            const factory = WebWorkerService.getWorkerFactory(MainSideRelay as any);
            if (factory) {
                this.isHost = true;
                this.setWorker(factory());
            }
        }

        public dispose() {
            super.dispose();
            if (this.isHost) {
                this.worker?.terminate();
            }
        }

        private sendInitMessage() {
            const msg: IWebworkerInitMessage = {
                messageId: -1,
                target: this.targetPath,
                type: MessageType.INIT,
                data: {
                    id: -1,
                    args: this.ctorArgs
                }
            }
            this.worker.addEventListener('message', (event: MessageEvent) => {
                const msg = event.data;
                if (isWebworkerMessage(msg)) {
                    const forMe = msg.target.join('.') === this.targetPath.join('.');
                    if (!this.workerInitialized) {
                        if (!isWebworkerInitMessage(msg) || !forMe) {
                            throw new Error('Not Initialized')
                        }
                        // init
                        this.workerInitialized = true;
                        this.initializeAsHost(msg);
                    } else {
                        if (!isWebworkerInitMessage(msg)) {
                            if (forMe) {
                                this.incommingMessages.next(msg);
                            } else {

                                const me = this.targetPath[0];
                                const it = msg.target[0];
                                const keys = [...msg.target];
                                keys.shift();

                                if (me === it) {
                                    let scope = this;
                                    while (keys.length) {
                                        const key = keys.shift();
                                        const pk = getPropertyKeyInst(scope, key as number);
                                        scope = scope[pk];
                                    }
                                    scope.incommingMessages.next(msg);
                                }
                            }
                        }

                    }
                }
            });
            this.postMessage(msg);
        }
        public setWorker(worker: Worker) {
            if (!this.worker) {
                this.worker = worker;
                if (this.isHost) {
                    this.sendInitMessage();
                }
                this.sendQueue();
            }
        }


        public postMessageInternal(msg: IWebworkerMessage<any>, transfer?: Transferable[]): void {
            this.worker.postMessage(msg, transfer);
        }

        public addProxy(remoteId: number, proxy: MainSideRelay): void {
            super.addProxy(remoteId, proxy);
            proxy.setWorker(this.worker);
        }
    };
    setRemoteClassIdentifier(MainSideRelay, id);
    return MainSideRelay;
}

function createWorkerSideRelay<T>(ofType: Type<T>, id: string): Type<IWebworkerRelay> {
    class WorkerSideRelay extends createWebWorkerRelay(ofType as Type) implements IWebworkerRelay {

        public constructor(...args: any[]) {
            super(...args);
            this.sendQueue();
        }
        /*private nextMessageId: number = 0;
        public readonly incommingMessages: Subject<IWebWorkerMessage> = new Subject();


        public constructor(...args: any[]) {
            super(...args);
            const targetKey = getTargetKey(this);
            addEventListener('message', (e: MessageEvent) => {
                const msg = e.data;
                if(isTargeted(msg)){
                    if(msg.target === targetKey){
                        this.incommingMessages.next(msg);
                    }
                }
            });
        }

        public postMessage(msg: IWebWorkerMessage, transfer?: Transferable[]): void {
            if (msg.messageId === undefined) {
                msg.messageId = this.nextMessageId++;
            }
            postMessage(msg, transfer);
        }
*/
        public initializeAsHost(msg: IWebworkerInitMessage): void {
            super.initializeAsHost(msg);
            addEventListener('message', (event: MessageEvent) => {
                const msg = event.data;
                if (isWebworkerMessage(msg)) {
                    const forMe = msg.target.join('.') === this.targetPath.join('.');
                    if (forMe) {
                        this.incommingMessages.next(msg);
                    } else {
                        const me = this.targetPath[0];
                        const it = msg.target[0];
                        const keys = [...msg.target];
                        keys.shift();
                        if (me === it) {
                            let scope = this;
                            while (keys.length) {
                                const key = keys.shift();
                                const pk = getPropertyKeyInst(scope, key as number);
                                scope = scope[pk];
                            }
                            scope.incommingMessages.next(msg);
                        }
                    }
                }
            });
            const response: IWebworkerInitMessage = {
                target: msg.target,
                type: MessageType.INIT,
                messageId: msg.messageId,
                data: {
                    id: msg.data.id,
                    args: undefined
                }
            }
            this.postMessage(response);
        }

        public postMessageInternal(msg: IWebworkerMessage<any>, transfer?: Transferable[]): void {
            postMessage(msg, transfer);
        }

    };
    setRemoteClassIdentifier(WorkerSideRelay, id);
    return WorkerSideRelay;
}

export function WebWorker(id: string): ClassDecorator {
    return <T extends Function>(target: T): T => {
        if (ENVIRONMENT_IS_WEB) {
            return createMainSideRelay(target as unknown as Type, id) as any;
        } else {
            return createWorkerSideRelay(target as unknown as Type, id) as any;
        }
    };
}
/*
export function WebWorker(id: string): ClassDecorator {
    return <T extends Function>(target: T): T => {
        if (ENVIRONMENT_IS_WORKER) {

            class WrapWorkerOnWorker extends (target as unknown as Type) {
                private nextMessageId: number = 0;
                constructor(...args: any[]) {
                    super(...args);
                    WebWorkerService.registerTarget(this);
                    this.postMessage({
                        type: MessageType.INIT,
                        data: undefined
                    });
                }

                protected postMessage<T extends IWebWorkerMessage>(msg: T, transferable?: Transferable[]) {
                    msg.messageId = this.nextMessageId++;
                    postMessage(msg, transferable);
                }
            }

            Reflect.defineMetadata(REMOTE_TARGET_KEY, id, Worker);
            return WrapWorkerOnWorker as unknown as T;
        } else {
            class WrapWorkerOnMain extends (target as unknown as Type) {
                private worker: Worker;
                private nextMessageId: number = 0;
                public messages: Subject<IWebWorkerMessage> = new Subject();

                constructor(...args: any[]) {
                    super();
                    WebWorkerService.registerTarget(this);
                    const factory = WebWorkerService.getWorkerFactory(WrapWorkerOnMain as any);
                    this.worker = factory();
                    this.initWorker(args);
                }

                private initWorker(args: any[]) {
                    this.worker.addEventListener('message', (ev: MessageEvent) => {
                        this.messages.next(ev.data);
                    })
                    this.postMessage({
                        type: MessageType.INIT,
                        messageId: 0,
                        data: args
                    });
                }

                protected postMessage<T extends IWebWorkerMessage>(msg: T, transferable?: Transferable[]) {
                    msg.messageId = this.nextMessageId++;
                    this.worker.postMessage(msg, transferable);
                }
            }
            Reflect.defineMetadata(REMOTE_TARGET_KEY, id, WrapWorkerOnMain);
            return WrapWorkerOnMain as unknown as T;
        }
    };

}
*/

const REMOTE_ID_KEY = '__webworker__.remoteId';
export function getRemoteMemberId(target: Object, propertyKey: string | symbol): number {
    return Reflect.getOwnMetadata(REMOTE_ID_KEY, target, propertyKey);
}

export function getPropertyKey(target: Object, remoteId: number): string {
    return Reflect.getMetadata(REMOTE_ID_KEY + '.' + remoteId, target);
}

export function getPropertyKeyInst(inst: Object, remoteId: number): string {
    return getPropertyKey(Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(inst))), remoteId);
}

export function getReturnTypeInst(inst: Object, remoteId: number): Type {
    const target = Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(inst)));
    const propertyKey = getPropertyKey(target, remoteId);
    const retType = Reflect.getMetadata('design:returntype', target, propertyKey) || Reflect.getMetadata('design:type', target, propertyKey);
    return retType;
}


export function getRemoteClassIdentifier(target: Object | Type): string {
    target = typeof target === 'function' ? target : target.constructor;
    return Reflect.getOwnMetadata(REMOTE_TARGET_KEY, target);
}
export function setRemoteClassIdentifier(target: Type, id: string) {
    Reflect.defineMetadata(REMOTE_TARGET_KEY, id, target);
}

function setRemoteMemberId(target: Object, propertyKey: string | symbol): number {
    const currKey: number = Reflect.getOwnMetadata(REMOTE_ID_KEY, target) || 0;
    Reflect.defineMetadata(REMOTE_ID_KEY, currKey + 1, target);

    Reflect.defineMetadata(REMOTE_ID_KEY, currKey, target, propertyKey);
    Reflect.defineMetadata(REMOTE_ID_KEY + '.' + currKey, propertyKey, target);
    return currKey;
}

function wrapPromiseMethod(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
    let desc: TypedPropertyDescriptor<any>;

    const rId = getRemoteMemberId(target, propertyKey);
    if (ENVIRONMENT_IS_WORKER) {

    } else {
        desc = {
            configurable: descriptor.configurable,
            enumerable: descriptor.enumerable,
            writable: descriptor.writable,
            value: async function (...args: any): Promise<any> {
                const self = this;
                const msgs = self.messages as Observable<IWebworkerMessage>;
                const msg: IWebworkerMethodCall = {
                    type: MessageType.METHOD_CALL,
                    memberId: rId,
                    target: [getRemoteClassIdentifier(self)],
                    data: args
                };

                const result = msgs.pipe(filter(_ => isWebworkerMethodCallResponse(_) && _.messageId === msg.messageId)).pipe(first()).toPromise() as Promise<IWebworkerMethodCallResponse>;
                this.postMessage(msg);
                const r = (await result).data;
                return r;
            }
        }
    }
    return desc;
}

function wrapObservableMethod(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {

}

function wrapObservableProperty(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
    let desc: TypedPropertyDescriptor<any>;
    const oGet = descriptor.get;
    const rId = getRemoteMemberId(target, propertyKey);

    if (ENVIRONMENT_IS_WORKER) {

    } else {
        const observers: Map<any, Observable<any>> = new Map();

        desc = {
            // configurable: descriptor.configurable,
            // enumerable: descriptor.enumerable,
            // writable: descriptor.writable,
            get: function () {
                const self = this;
                let obs = observers.get(self);
                if (!obs) {
                    const msgId = self.nextMessageId++;
                    obs = Observable.create((subscriber: Subscriber<any>) => {
                        const msgs = self.messages as Observable<IWebworkerMessage>;
                        const submsg: IWebworkerSubscribeCall = {
                            messageId: msgId,
                            target: [getRemoteClassIdentifier(self)],
                            memberId: rId,
                            type: MessageType.SUBSCRIBE
                        }
                        self.postMessage(submsg);

                        const sub = msgs.pipe(filter(_ => _.type === MessageType.NEXT && submsg.messageId === _.messageId)).subscribe((msg) => {
                            subscriber.next(msg.data);
                        });
                        return () => {
                            sub.unsubscribe();
                            const unsubmsg: IWebworkerUnsubscribeCall = {
                                messageId: submsg.messageId,
                                target: [getRemoteClassIdentifier(self)],
                                memberId: rId,
                                type: MessageType.UNSUBSCRIBE
                            }
                            self.postMessage(unsubmsg);
                        };
                    }).pipe(share());
                    observers.set(this, obs);
                }

                return obs;
            }
        }
    }

    return desc;
}

export enum WebWorkerSide {
    MAIN,
    WORKER
}

function createProxyPromiseMethod(memberId: number): (...args: any[]) => Promise<any> {
    return function promiseMethodProxy(this: IWebworkerRelay, ...args: any[]): Promise<any> {
        return this.postPromiseMethodCall(memberId, args);
    }
}


function createProxyPromiseField(memberId: number, descriptor?: TypedPropertyDescriptor<any>): PropertyDescriptor {
    return {
        get: function promiseProxyGet(this: IWebworkerRelay): Promise<any> {
            return this.postPromiseFieldGet(memberId);
        },
        set: function promiseProxySet(this: IWebworkerRelay, value: Promise<any>): void {
            // throw new Error('Cannot set from this side')
        }
    }
}

function createPromiseField(memberId: number, descriptor?: TypedPropertyDescriptor<any>): PropertyDescriptor {
    let __value__: any;
    return {
        get: function promiseProxyGet(this: IWebworkerRelay): Promise<any> {
            return descriptor ? descriptor.get.call(this) : __value__;
        },
        set: function promiseProxySet(this: IWebworkerRelay, value: Promise<any>): void {
            if (descriptor) {
                descriptor.set.call(this, value);
            } else {
                __value__ = value;
            }
            this.postPromiseFieldSet(memberId);
        }
    }
}

function createProxyObservableField(memberId: number, descriptor?: TypedPropertyDescriptor<any>): PropertyDescriptor {
    return {
        get: function promiseObservableGet(this: IWebworkerRelay): Observable<any> {
            return this.postObservableFieldGet(memberId);
        },
        set: function promiseObservableSet(this: IWebworkerRelay, value: Observable<any>): void {
            // throw new Error('Cannot set from this side')
        }
    }
}

function createObservableField(memberId: number, descriptor?: TypedPropertyDescriptor<any>): PropertyDescriptor {
    let __value__: any;
    return {
        get: function promiseObservableGet(this: IWebworkerRelay): Observable<any> {
            return descriptor ? descriptor.get.call(this) : __value__;
        },
        set: function promiseObservableSet(this: IWebworkerRelay, value: Observable<any>): void {
            if (descriptor) {
                descriptor.set.call(this, value);
            } else {
                __value__ = value;
            }
            //this.postObservableFieldSet(memberId);
        }
    }
}

function createProxyObservableMethod(memberId: number): PropertyDescriptor {
    return {
        value: function observable(this: IWebworkerRelay, ...args: any[]): Observable<any> {
            return this.postObservableMethodCall(memberId, args);
        }
    };
}

function createObservableMethod(memberId: number): PropertyDescriptor {
    let __value__: any;
    return {
        value: function observable(this: IWebworkerRelay, ...args: any[]): void {
            // thow out inactive
        }
    };
}
/*

 const self = this;
                const msgs = self.messages as Observable<IWebWorkerMessage>;
                const msg: IWebWorkerCall = {
                    type: MessageType.METHOD_CALL,
                    method: rId,
                    target: getTargetKey(self),
                    data: args
                };

                const result = msgs.pipe(filter(_ => isMethodReturn(_) && _.messageId === msg.messageId)).pipe(first()).toPromise() as Promise<IWebWorkerCallResponse>;
                this.postMessage(msg);
                const r = (await result).data;
                return r;

                */

function isOfType(a: Type | object, b: Type): boolean {
    if (a == null || a == undefined) {
        return false;
    }
    if (a === b || a instanceof b) {
        return true;
    }
    return isOfType(Reflect.getPrototypeOf(a), b);
}

function createProxyMember(forSide: WebWorkerSide, target: any, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
    const thisSide = !((forSide === WebWorkerSide.MAIN && ENVIRONMENT_IS_WORKER) || (forSide === WebWorkerSide.WORKER && ENVIRONMENT_IS_WEB));
    const memberId = setRemoteMemberId(target, propertyKey);
    const isField = !descriptor;
    const isMethod = !isField && !!descriptor.value;
    const isProperty = !isField && !isMethod && !!descriptor.get;
    const isReadOnly = isProperty && !descriptor.set;
    const retType = isMethod ? Reflect.getMetadata('design:returntype', target, propertyKey) : Reflect.getMetadata('design:type', target, propertyKey);

    if (!isOfType(retType, Promise) && !isOfType(retType, Observable)) {
        throw new Error(`'${target.constructor.name}.${propertyKey.toString()}' must return a Promise or Observable but returns type '${retType?.name || 'unknown'}'`)
    }

    if (isMethod) {
        if (!thisSide) {
            return;
        }
        if (isOfType(retType, Promise)) {
            return {
                value: createProxyPromiseMethod(memberId)
            }
        } else {
            if (thisSide) {
                return createProxyObservableMethod(memberId);

            } else {
                return createObservableMethod(memberId);
            }

        }
    } else if (isField) {
        if (isOfType(retType, Promise)) {
            if (thisSide) {
                Reflect.defineProperty(target, propertyKey, createProxyPromiseField(memberId));
            } else {
                Reflect.defineProperty(target, propertyKey, createPromiseField(memberId));
            }
        } else {
            if (thisSide) {
                Reflect.defineProperty(target, propertyKey, createProxyObservableField(memberId));
            } else {
                Reflect.defineProperty(target, propertyKey, createObservableField(memberId));
            }
        }
    } else if (isProperty) {
        if (isOfType(retType, Promise)) {
            if (thisSide) {
                return createProxyPromiseField(memberId, descriptor);
            } else {
                return createPromiseField(memberId, descriptor);
            }
        } else {
            if (thisSide) {
                return createProxyObservableField(memberId, descriptor);
            } else {
                return createObservableField(memberId, descriptor);
            }
        }
    }
}

const CACHED_KEY = '__cache_value__'
function getCacheValue(inst: any, propertyKey: string | symbol, key: string): any {
    return (Reflect.getOwnMetadata(CACHED_KEY, inst, propertyKey) as Map<string, any>)?.get(key);
}
function setCacheValue(inst: any, propertyKey: string | symbol, key: string, value: void): any {
    if (!Reflect.hasOwnMetadata(CACHED_KEY, inst, propertyKey)) {
        Reflect.defineMetadata(CACHED_KEY, new Map(), inst, propertyKey);
    }
    const m: Map<string, any> = Reflect.getOwnMetadata(CACHED_KEY, inst, propertyKey);
    m.set(key, value);
}

function hasCacheValue(inst: any, propertyKey: string | symbol, key: string): boolean {
    return (Reflect.getOwnMetadata(CACHED_KEY, inst, propertyKey) as Map<string, any>)?.has(key);
}

function deleteCacheValue(inst: any, propertyKey: string | symbol, key: string): void {
    (Reflect.getOwnMetadata(CACHED_KEY, inst, propertyKey) as Map<string, any>)?.delete(key);
}
export function Cache(): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
        const isProperty = !!descriptor.get;
        const isMethod = !isProperty && !!descriptor.value;
        if (isMethod) {
            return {
                value: function (...args: any[]): any {
                    const key = JSON.stringify(args);
                    if (hasCacheValue(this, propertyKey, key)) {
                        return getCacheValue(this, propertyKey, key);
                    }
                    const ret = descriptor.value.apply(this, args);
                    setCacheValue(this, propertyKey, key, ret);
                    return ret;
                }
            };
        } else {
            return {
                get: function (): any {
                    if (hasCacheValue(this, propertyKey, '')) {
                        return getCacheValue(this, propertyKey, '');
                    }
                    const ret = descriptor.get.call(this);
                    setCacheValue(this, propertyKey, '', ret);
                    return ret;
                },
                set: function (value: any): void {
                    if (descriptor.set) {
                        deleteCacheValue(this, propertyKey, '')
                        descriptor.set.call(this, value);
                    }
                }
            };
        }
    };
}

export function RunOnWorker(): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
        return createProxyMember(WebWorkerSide.MAIN, target, propertyKey, descriptor);
    };
}

export function RunOnMain(): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
        return createProxyMember(WebWorkerSide.WORKER, target, propertyKey, descriptor);
    };
}

export function OnWorker(): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        createProxyMember(WebWorkerSide.MAIN, target, propertyKey);
    };
}

export function OnMain(): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        createProxyMember(WebWorkerSide.WORKER, target, propertyKey);
    };
}


function getInstKey(propertyKey: string, subkey: string): string {
    return `___${propertyKey}_${subkey}`;
}
function setInstValue(inst: any, propertyKey: string | symbol, subkey: string, value: any) {
    const key = getInstKey(propertyKey.toString(), subkey);
    inst[key] = value;
}

function getInstValue(inst: any, propertyKey: string | symbol, subkey: string): any {
    const key = getInstKey(propertyKey.toString(), subkey);
    return inst[key];
}

export function Proxy(): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        const memberId = setRemoteMemberId(target, propertyKey);
        Reflect.defineProperty(target, propertyKey, {
            get: function (this: IWebworkerRelayInternal) {
                const value = getInstValue(this, propertyKey, 'value');
                if (!getInstValue(this, propertyKey, 'initializedValue')) {
                    setInstValue(this, propertyKey, 'initializedValue', value);
                    this.addProxy(memberId, value);
                } else {
                    if (this.worker && typeof value.setWorker === 'function') {
                        value.setWorker(this.worker);
                    }
                }
                return value;
            },
            set: function (this: IWebworkerRelay, value: any): void {
                setInstValue(this, propertyKey, 'initializedValue', null);
                setInstValue(this, propertyKey, 'value', value);
            }
        });
        //return createProxyMember(WebWorkerSide.MAIN, target, propertyKey, descriptor);

    };
}

/*
export function RunOnWorker(): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
        const retType = Reflect.getMetadata('design:returntype', target, propertyKey) || Reflect.getMetadata('design:type', target, propertyKey);
        setRemoteId(target, propertyKey);
        switch (retType) {
            case Promise:
                return wrapPromiseMethod(target, propertyKey, descriptor);
            case Observable:
                if (descriptor.set) {
                    throw new Error(`Observable must be readonly`);
                }
                if (descriptor.value) {
                    return wrapObservableMethod(target, propertyKey, descriptor);
                }
                return wrapObservableProperty(target, propertyKey, descriptor);
            default:
                throw new Error(`Return type must be of type Promise or Observable`);
        }
    };
}
*/


export function WorkerOnly(): MethodDecorator | PropertyDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
        if (ENVIRONMENT_IS_WEB) {
            if (descriptor?.value) {
                return {
                    value: () => {
                        throw new Error(`Cannot call method '${propertyKey.toString()}'. Call only allowed on worker.`)
                    }
                }
            } else {
                const desc = {
                    get: () => {
                        throw new Error(`Cannot access property '${propertyKey.toString()}'. Access only allowed on worker.`)
                    },
                    set: () => {
                        throw new Error(`Cannot set property '${propertyKey.toString()}'. Access only allowed on worker.`)
                    }
                }
                if (!descriptor) {
                    Reflect.defineProperty(target, propertyKey, desc);
                } else {
                    return desc;
                }
            }
        }
    };
}

export function MainOnly(): MethodDecorator | PropertyDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
        if (ENVIRONMENT_IS_WORKER) {
            if (descriptor?.value) {
                return {
                    value: () => {
                        throw new Error(`Cannot call method '${propertyKey.toString()}'. Call only allowed on main thread.`)
                    }
                }
            } else {
                const desc = {
                    get: () => {
                        throw new Error(`Cannot access property '${propertyKey.toString()}'. Access only allowed on main thread.`)
                    },
                    set: () => {
                        throw new Error(`Cannot set property '${propertyKey.toString()}'. Access only allowed on main thread.`)
                    }
                }
                if (!descriptor) {
                    Reflect.defineProperty(target, propertyKey, desc);
                } else {
                    return desc;
                }
            }
        }
    };
}

export function FromWorker(): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        const retType = Reflect.getMetadata('design:returntype', target, propertyKey);
        setRemoteMemberId(target, propertyKey);
        switch (retType) {
            case Observable:
                //wrapPromiseMethod(target, propertyKey, descriptor);
                break;
            default:
                throw new Error(`Return type must be of type Observable`);
        }
    };
}