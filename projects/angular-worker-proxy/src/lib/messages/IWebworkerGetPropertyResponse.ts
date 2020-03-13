import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
export interface IWebworkerGetPropertyResponse<T = any> extends IWebworkerMessage<T> {
    type: MessageType.FIELD_RETURN;
}
;
export function isWebworkerGetPropertyResponse(obj: IWebworkerMessage | any): obj is IWebworkerGetPropertyResponse {
    return obj.type === MessageType.FIELD_RETURN;
}
