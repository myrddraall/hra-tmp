import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
import { IWebworkerMemberMessage } from './IWebworkerMemberMessage';
export interface IWebworkerMethodCall extends IWebworkerMemberMessage<any[]> {
    type: MessageType.METHOD_CALL;
}
;
export function isWebworkerMethodCall(obj: IWebworkerMessage): obj is IWebworkerMethodCall {
    return obj.type === MessageType.METHOD_CALL;
}
