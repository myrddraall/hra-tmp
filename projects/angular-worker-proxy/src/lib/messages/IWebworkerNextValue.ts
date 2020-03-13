import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
import { IWebworkerMemberMessage } from './IWebworkerMemberMessage';
export interface IWebworkerNextValue<T = any> extends IWebworkerMemberMessage<T> {
    type: MessageType.NEXT;
}
;
export function isWebworkerNextValue(obj: IWebworkerMessage): obj is IWebworkerNextValue {
    return obj.type === MessageType.NEXT;
}
