import { Type } from './Type'
import { IWebWorkerMessage, MessageType, isMethodCall, REMOTE_TARGET_KEY, getPropertyKey, IWebWorkerCallResponse, isSubscribe, getPropertyKeyInst, IWebWorkerNext, isTargeted, isUnsubscribe } from './web-worker-proxy.decorator';
import { Observable, Unsubscribable } from 'rxjs';

export declare type WorkerFactory = () => Worker;
declare function postMessage(message: any, transfer: Transferable[]): void;
declare function postMessage(message: any, options?: PostMessageOptions): void;

export class WebWorkerService {

    private static _factories: Map<Type, WorkerFactory> = new Map();
    private static _instances: Map<string, any> = new Map();

    public static registerWorkerFactory<T>(forClass: Type, fn: WorkerFactory): void {
        WebWorkerService._factories.set(forClass, fn);
    }

    public static getWorkerFactory(forClass: Type): WorkerFactory {
        return WebWorkerService._factories.get(forClass);
    }

    public static registerTarget(instance: any): void {
        const targetName = Reflect.getMetadata(REMOTE_TARGET_KEY, instance.constructor);
        WebWorkerService._instances.set(targetName, instance);
        //return WebWorkerService._factories.get(forClass);
    }

    public static getTarget(targetName: string): any {
        return WebWorkerService._instances.get(targetName);
    }

    public static runWorker(ofClass: Type): void {
        let instance: any;
        const unsubs: Map<string, Unsubscribable> = new Map();
        addEventListener('message', async ({ data }) => {
            const msg: IWebWorkerMessage = data;
            console.log(msg);
            if (!instance) {
                if (msg.type !== MessageType.INIT) {
                    // throw error
                } else {
                    instance = new ofClass(...msg.data);

                }

            } else if (isTargeted(msg)) {
                const tInst = this.getTarget(msg.target);
                const methodKey = getPropertyKeyInst(tInst, msg.method);
                const method = tInst[methodKey];
                if (isMethodCall(msg)) {
                    const result = await method.apply(tInst, msg.data);
                    const msgReturn: IWebWorkerCallResponse = {
                        type: MessageType.METHOD_RETURN,
                        messageId: msg.messageId,
                        data: result
                    };
                    postMessage(msgReturn);

                } else if (isSubscribe(msg)) {
                    if (method instanceof Observable) {
                        console.log('isSubscribe')
                        const unsub = method.subscribe(data => {
                            console.log('next value on worker', data);
                            const msgNext: IWebWorkerNext = {
                                type: MessageType.NEXT,
                                messageId: msg.messageId,
                                target: msg.target,
                                method: msg.method,
                                data
                            };
                            postMessage(msgNext);
                        });
                        unsubs.set(msg.target + '__' + msg.method, unsub);
                    }
                } else if (isUnsubscribe(msg)) {
                    const unsub = unsubs.get(msg.target + '__' + msg.method);
                    console.log('isUnsubscribe', unsub);
                    if(unsub){
                        unsub.unsubscribe();
                        unsubs.delete(msg.target + '__' + msg.method);
                    }
                }

            } else {
                
            }
        });
    }


}