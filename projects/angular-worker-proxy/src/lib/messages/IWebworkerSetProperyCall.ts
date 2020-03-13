import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
import { IWebworkerMemberMessage } from './IWebworkerMemberMessage';
export interface IWebworkerSetProperyCall<T = any> extends IWebworkerMemberMessage<T> {
    type: MessageType.FIELD_SET;
}
;
export function isWebworkerSetProperyCall(obj: IWebworkerMessage | any): obj is IWebworkerSetProperyCall {
    return obj.type === MessageType.FIELD_SET;
}
