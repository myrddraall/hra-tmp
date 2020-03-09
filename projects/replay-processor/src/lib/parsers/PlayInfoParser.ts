import { ReplayParser } from './ReplayParser';
import { ReplayAttributeHelper } from 'heroesprotocol-data';
import * as linq from 'linq';
import { IPlayerSlot,ISlotInfo, SlotType } from 'heroesprotocol-data';


export class PlayerInfoParser extends ReplayParser<any[]> {



    public async parse(): Promise<any[]> {
        const initData = await this.replay.initData;
        const details = await this.replay.details;
        const attrib = new ReplayAttributeHelper(await this.replay.attributeEvents);
        const slotInfo: Partial<ISlotInfo>[] = [];

        // all slots inc obs, has skin
        const lobbySlots = initData.m_syncLobbyState.m_lobbyState.m_slots;

console.log('lobbySlots', lobbySlots)

        // has usernames contains names, joined on index -> m_lobbyState.m_slots.userId
        const userInit = initData.m_syncLobbyState.m_userInitialData;

        // only actual players of the game, conatains  realm and region info and game result
        const detailPlayerlist = details.m_playerList;

        for (let i = 0; i < 10; i++) {
            const slot = lobbySlots[i];

            const info: Partial<ISlotInfo> = {
                index: i,
                m_announcerPack: slot.m_announcerPack,
                m_banner: slot.m_banner,
                m_control: slot.m_control,
                m_hasSilencePenalty: slot.m_hasSilencePenalty,
                m_hasVoiceSilencePenalty: slot.m_hasVoiceSilencePenalty,
                m_heroHandle: slot.m_hero,
                m_mount: slot.m_mount,
                m_observe: slot.m_observe,
                m_skin: slot.m_skin,
                m_spray: slot.m_spray,
                m_teamId: slot.m_teamId,
                m_toonHandle: slot.m_toonHandle,
                m_userId: slot.m_userId,
                m_voiceLine: slot.m_voiceLine,
                m_workingSetSlotId: slot.m_workingSetSlotId,
                m_name: slot.m_userId !== null ? userInit[slot.m_userId].m_name : null
            };
            slotInfo.push(info);
        }

        const slotInfoQ = linq.from(slotInfo);

        for (let i = 0; i < detailPlayerlist.length; i++) {
            const detail = detailPlayerlist[i];
            const slot = slotInfoQ.singleOrDefault(_ => _.m_workingSetSlotId === detail.m_workingSetSlotId);
            if (slot) {
                slot.m_toon_id = detail.m_toon.m_id;
                slot.m_programId = detail.m_toon.m_programId;
                slot.m_realm = detail.m_toon.m_realm;
                slot.m_region = detail.m_toon.m_region;
                slot.m_result = detail.m_result;
                slot.m_hero = detail.m_hero;
            }
        }

        const slotList: IPlayerSlot[] = slotInfoQ
            .orderBy(_ => _.m_workingSetSlotId)
            .select(_ => {
                let slotType: SlotType;
                if (_.m_toonHandle && _.m_observe == 1) {
                    slotType = SlotType.OBSERVER;
                } else if (_.m_toonHandle) {
                    slotType = SlotType.PLAYER;
                } else if (_.m_hero) {
                    slotType = SlotType.AI;
                }
                else {
                    slotType = SlotType.EMPTY;
                }
                const slot: IPlayerSlot = {
                    type: slotType,
                    id: _.m_toon_id,
                    index: _.index,
                    realm: _.m_realm,
                    region: _.m_region,
                    handle: _.m_toonHandle,
                    userId: _.m_userId,
                    won: _.m_result === 1,
                    slot: _.m_workingSetSlotId,
                    name: _.m_name,
                    team: slotType === SlotType.PLAYER || slotType === SlotType.AI ? _.m_teamId : -1,
                    hero: _.m_hero,
                    role: attrib.getPlayerRole(_.index),
                    heroHandle: _.m_heroHandle,
                    skin: _.m_skin,
                    mount: _.m_mount,
                    spray: _.m_spray,
                    announcerPack: _.m_announcerPack,
                    banner: _.m_banner,
                    voiceLine: _.m_voiceLine,
                    hasChatSilence: _.m_hasSilencePenalty,
                    hasVoiceSilence: _.m_hasVoiceSilencePenalty
                };
                console.log(slot);
                return slot;
            })
            .toArray();
        return slotList;

    }

}