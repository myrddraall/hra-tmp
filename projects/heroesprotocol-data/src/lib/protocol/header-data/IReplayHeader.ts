import { IReplayDataObject } from '../base/index';
import { IReplayVersion } from './IReplayVersion';

export interface IReplayHeader {
    readonly m_dataBuildNum: number;
    readonly m_elapsedGameLoops: number;
    readonly m_ngdpRootKey: IReplayDataObject;
    readonly m_replayCompatibilityHash: IReplayDataObject;
    readonly m_signature: string;
    readonly m_type: number;
    readonly m_useScaledTime: boolean;
    readonly m_version: IReplayVersion;
}