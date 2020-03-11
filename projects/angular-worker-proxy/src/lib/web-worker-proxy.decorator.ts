import { __extends } from 'tslib';
import { ENVIRONMENT_IS_WORKER, ENVIRONMENT_IS_WEB } from './env';
import { Type } from './Type';
import { WebWorkerService } from './web-worker.service';
import "reflect-metadata";
import { Observable, Subject, observable, Subscriber } from 'rxjs';
declare function postMessage(message: any, transfer: Transferable[]): void;
declare function postMessage(message: any, options?: PostMessageOptions): void;
import { filter, first, share } from 'rxjs/operators';

export enum MessageType {
    INIT,
    METHOD_CALL,
    METHOD_RETURN,
    SUBSCRIBE,
    NEXT,
    UNSUBSCRIBE,
}

export interface IWebWorkerMessage<T = any> {
    messageId?: number;
    type: MessageType;
    data?: T
};

export interface IWebWorkerCallResponse<T = any> extends IWebWorkerMessage<T> {
    type: MessageType.METHOD_RETURN;
};


export interface IWebWorkerTargeted<T = any> extends IWebWorkerMessage<T> {
    target: string;
    method: number;
}
export interface IWebWorkerCall extends IWebWorkerTargeted<any[]> {
    type: MessageType.METHOD_CALL;
};

export interface IWebWorkerSubscribe extends IWebWorkerTargeted<void> {
    type: MessageType.SUBSCRIBE;
};

export interface IWebWorkerUnsubscribe extends IWebWorkerTargeted<void> {
    type: MessageType.UNSUBSCRIBE;
};

export interface IWebWorkerNext<T = any> extends IWebWorkerTargeted<T> {
    type: MessageType.NEXT;
};

export function isTargeted(obj: IWebWorkerMessage | any): obj is IWebWorkerTargeted {
    return typeof obj.target === 'string' && typeof obj.method === 'number';
}

export function isMethodCall(obj: IWebWorkerMessage): obj is IWebWorkerCall {
    return obj.type === MessageType.METHOD_CALL;
}

export function isMethodReturn(obj: IWebWorkerMessage): obj is IWebWorkerCallResponse {
    return obj.type === MessageType.METHOD_RETURN;
}

export function isSubscribe(obj: IWebWorkerMessage): obj is IWebWorkerSubscribe {
    return obj.type === MessageType.SUBSCRIBE;
}

export function isUnsubscribe(obj: IWebWorkerMessage): obj is IWebWorkerUnsubscribe {
    return obj.type === MessageType.UNSUBSCRIBE;
}

export function isNextValue(obj: IWebWorkerMessage): obj is IWebWorkerNext {
    return obj.type === MessageType.NEXT;
}

export const REMOTE_TARGET_KEY = '__webworker__.targetKey';

export function WebWorker(id: string): ClassDecorator {
    return <T extends Function>(target: T): T => {
        if (ENVIRONMENT_IS_WORKER) {
            class Worker extends (target as unknown as Type) {
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
            return Worker as unknown as T;
        } else {
            class WorkerProxy extends (target as unknown as Type) {
                private worker: Worker;
                private nextMessageId: number = 0;
                public messages: Subject<IWebWorkerMessage> = new Subject();

                constructor(...args: any[]) {
                    super();
                    WebWorkerService.registerTarget(this);
                    const factory = WebWorkerService.getWorkerFactory(WorkerProxy as any);
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
            Reflect.defineMetadata(REMOTE_TARGET_KEY, id, WorkerProxy);
            return WorkerProxy as unknown as T;
        }
    };

}

const REMOTE_ID_KEY = '__webworker__.remoteId';
export function getRemoteId(target: Object, propertyKey: string | symbol): number {
    return Reflect.getOwnMetadata(REMOTE_ID_KEY, target, propertyKey);
}

export function getPropertyKey(target: Object, remoteId: number): number {
    return Reflect.getOwnMetadata(REMOTE_ID_KEY + '.' + remoteId, target);
}

export function getPropertyKeyInst(inst: Object, remoteId: number): number {
    return getPropertyKey(Object.getPrototypeOf(Object.getPrototypeOf(inst)), remoteId);
}



export function getTargetKey(target: Object): string {
    return Reflect.getOwnMetadata(REMOTE_TARGET_KEY, target.constructor);
}
function setRemoteId(target: Object, propertyKey: string | symbol) {
    const currKey: number = Reflect.getOwnMetadata(REMOTE_ID_KEY, target) || 0;
    Reflect.defineMetadata(REMOTE_ID_KEY, currKey + 1, target);
    Reflect.defineMetadata(REMOTE_ID_KEY, currKey, target, propertyKey);
    Reflect.defineMetadata(REMOTE_ID_KEY + '.' + currKey, propertyKey, target);
}

function wrapPromiseMethod(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void {
    let desc: TypedPropertyDescriptor<any>;

    const rId = getRemoteId(target, propertyKey);
    if (ENVIRONMENT_IS_WORKER) {

    } else {
        desc = {
            configurable: descriptor.configurable,
            enumerable: descriptor.enumerable,
            writable: descriptor.writable,
            value: async function (...args: any): Promise<any> {
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
    const rId = getRemoteId(target, propertyKey);

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
                        const msgs = self.messages as Observable<IWebWorkerMessage>;
                        const submsg: IWebWorkerSubscribe = {
                            messageId: msgId,
                            target: getTargetKey(self),
                            method: rId,
                            type: MessageType.SUBSCRIBE
                        }
                        self.postMessage(submsg);

                        const sub = msgs.pipe(filter(_ => _.type === MessageType.NEXT && submsg.messageId === _.messageId)).subscribe((msg) => {
                            subscriber.next(msg.data);
                        });
                        return () => {
                            sub.unsubscribe();
                            const unsubmsg: IWebWorkerUnsubscribe = {
                                messageId: submsg.messageId,
                                target: getTargetKey(self),
                                method: rId,
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


export function WorkerOnly(): MethodDecorator | PropertyDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
        if(ENVIRONMENT_IS_WEB){
            if(descriptor?.value){
                return {
                    value: () =>{
                        throw new Error(`Cannot call method '${propertyKey.toString()}'. Call only allowed on worker.`) 
                    }
                }
            } else {
                const desc =  {
                    get: () =>{
                        throw new Error(`Cannot access property '${propertyKey.toString()}'. Access only allowed on worker.`) 
                    },
                    set: () =>{
                        throw new Error(`Cannot set property '${propertyKey.toString()}'. Access only allowed on worker.`) 
                    }
                }
                if(!descriptor){
                    Reflect.defineProperty(target, propertyKey, desc);
                }else{
                    return desc;
                }
            }
        }
    };
}

export function MainOnly(): MethodDecorator | PropertyDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
        if(ENVIRONMENT_IS_WORKER){
            if(descriptor?.value){
                return {
                    value: () =>{
                        throw new Error(`Cannot call method '${propertyKey.toString()}'. Call only allowed on main thread.`) 
                    }
                }
            } else {
                const desc =  {
                    get: () =>{
                        throw new Error(`Cannot access property '${propertyKey.toString()}'. Access only allowed on main thread.`) 
                    },
                    set: () =>{
                        throw new Error(`Cannot set property '${propertyKey.toString()}'. Access only allowed on main thread.`) 
                    }
                }
                if(!descriptor){
                    Reflect.defineProperty(target, propertyKey, desc);
                }else{
                    return desc;
                }
            }
        }
    };
}

export function FromWorker(): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        const retType = Reflect.getMetadata('design:returntype', target, propertyKey);
        setRemoteId(target, propertyKey);
        switch (retType) {
            case Observable:
                //wrapPromiseMethod(target, propertyKey, descriptor);
                break;
            default:
                throw new Error(`Return type must be of type Observable`);
        }
    };
}