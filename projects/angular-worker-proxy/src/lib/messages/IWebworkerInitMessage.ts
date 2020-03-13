import { MessageType } from './MessageType';
import { IWebworkerMessage } from './IWebworkerMessage';
export interface IWebworkerInitMessage extends IWebworkerMessage<{
    id: number;
    args: any[];
}> {
    type: MessageType.INIT;
}
export function isWebworkerInitMessage(obj: IWebworkerMessage | any): obj is IWebworkerInitMessage {
    return obj.type === MessageType.INIT;
}
