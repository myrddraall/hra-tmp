import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
import { IWebworkerMemberMessage } from './IWebworkerMemberMessage';
export interface IWebworkerSubscriptionComplete<T = any> extends IWebworkerMemberMessage<T> {
    type: MessageType.COMPLETE;
}
export function isWebworkerSubscriptionComplete(obj: IWebworkerMessage): obj is IWebworkerSubscriptionComplete {
    return obj.type === MessageType.COMPLETE;
}
