import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
import { IWebworkerMemberMessage } from './IWebworkerMemberMessage';
export interface IWebworkerGetPropertyCall<T = any> extends IWebworkerMemberMessage<T> {
    type: MessageType.FIELD_GET;
}
;
export function isWebworkerGetPropertyCall(obj: IWebworkerMessage | any): obj is IWebworkerGetPropertyCall {
    return obj.type === MessageType.FIELD_GET;
}
