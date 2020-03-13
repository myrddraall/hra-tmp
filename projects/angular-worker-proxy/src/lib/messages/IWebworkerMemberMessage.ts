import { IWebworkerMessage } from './IWebworkerMessage';
export interface IWebworkerMemberMessage<T = any> extends IWebworkerMessage<T> {
    memberId: number;
}
export function isWebworkerMemberMessage(obj: IWebworkerMessage | any): obj is IWebworkerMemberMessage {
    return typeof obj.target === 'string' && typeof obj.method === 'number';
}
