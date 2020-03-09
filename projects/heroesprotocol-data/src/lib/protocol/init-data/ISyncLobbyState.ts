import { IUserInitialData } from "./IUserInitialData";
import { ILobbyState } from "./ILobbyState";
import { IGameDescription } from "./IGameDescription";
export interface ISyncLobbyState {
    m_gameDescription: IGameDescription;
    m_lobbyState: ILobbyState;
    m_userInitialData: IUserInitialData[];
}
