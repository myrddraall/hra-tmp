import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
import { IWebworkerMemberMessage } from './IWebworkerMemberMessage';
export interface IWebworkerSubscriptionError<T = any> extends IWebworkerMemberMessage<T> {
    type: MessageType.ERROR;
}
;
export function isWebworkerSubscriptionError(obj: IWebworkerMessage): obj is IWebworkerSubscriptionError {
    return obj.type === MessageType.ERROR;
}
