import { Type } from './Type'
import { REMOTE_TARGET_KEY, getPropertyKey, getPropertyKeyInst, IWebworkerRelay } from './web-worker-proxy.decorator';
import { IWebworkerNextValue } from "./messages/IWebworkerNextValue";
import { isWebworkerUnsubscribeCall } from "./messages/IWebworkerUnsubscribeCall";
import { isWebworkerSubscribeCall } from "./messages/IWebworkerSubscribeCall";
import { IWebworkerMethodCallResponse } from "./messages/IWebworkerMethodCallResponse";
import { isWebworkerMethodCall } from "./messages/IWebworkerMethodCall";
import { isWebworkerMemberMessage } from "./messages/IWebworkerMemberMessage";
import { isWebworkerInitMessage } from "./messages/IWebworkerInitMessage";
import { IWebworkerMessage, isWebworkerMessage } from "./messages/IWebworkerMessage";
import { MessageType } from "./messages/MessageType";
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
        let hostInstance: IWebworkerRelay = null;

        const listener = (event: MessageEvent) => {
            const msg = event.data;
            if (isWebworkerMessage(msg)) {
                if(hostInstance){
                    throw new Error(`Host instance for '${ofClass.name}' already initialized.`);
                }else if(!isWebworkerInitMessage(msg) || msg.data.id !== -1){
                    throw new Error(`Host instance for '${ofClass.name}' not yet initialized.`)
                }
                hostInstance = new ofClass(...msg.data.args);
                hostInstance.initializeAsHost(msg);
                removeEventListener('message', listener);
            }
        };

        addEventListener('message', listener);
        /*let instance: any;
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
        */
    }


}