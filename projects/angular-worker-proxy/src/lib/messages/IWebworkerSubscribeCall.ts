import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
import { IWebworkerMemberMessage } from './IWebworkerMemberMessage';
export interface IWebworkerSubscribeCall extends IWebworkerMemberMessage<any[] | void> {
    type: MessageType.SUBSCRIBE;
}
;
export function isWebworkerSubscribeCall(obj: IWebworkerMessage): obj is IWebworkerSubscribeCall {
    return obj.type === MessageType.SUBSCRIBE;
}
