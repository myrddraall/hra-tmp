import { MessageType } from './MessageType';
export interface IWebworkerMessage<T = any> {
    messageId?: number;
    type: MessageType;
    target: Array<string | number>;
    data?: T;
}
;
export function isWebworkerMessage(obj: IWebworkerMessage | any): obj is IWebworkerMessage {
    return typeof obj.type === 'number' && typeof obj.messageId === 'number' && Array.isArray(obj.target);
}
