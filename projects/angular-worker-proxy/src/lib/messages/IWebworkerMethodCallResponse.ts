import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
export interface IWebworkerMethodCallResponse<T = any> extends IWebworkerMessage<T> {
    type: MessageType.METHOD_RETURN;
}
;
export function isWebworkerMethodCallResponse(obj: IWebworkerMessage): obj is IWebworkerMethodCallResponse {
    return obj.type === MessageType.METHOD_RETURN;
}
