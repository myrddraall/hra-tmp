import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
import { IWebworkerMemberMessage } from './IWebworkerMemberMessage';
export interface IWebworkerUnsubscribeCall extends IWebworkerMemberMessage<void> {
    type: MessageType.UNSUBSCRIBE;
}
;
export function isWebworkerUnsubscribeCall(obj: IWebworkerMessage): obj is IWebworkerUnsubscribeCall {
    return obj.type === MessageType.UNSUBSCRIBE;
}
