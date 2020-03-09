import { SlotType } from './SlotType';
import { HeroRole } from '../../../heroes/HeroRole';
export interface IPlayerSlot {
    type: SlotType;
    id: number;
    index: number;
    realm: number;
    region: number;
    handle: string;
    userId: number;
    won: boolean;
    slot: number;
    name: string;
    team: number;
    hero: string;
    role: HeroRole;
    heroHandle: string;
    skin: string;
    mount: string;
    spray: string;
    announcerPack: string;
    banner: string;
    voiceLine: string;
    hasChatSilence: boolean;
    hasVoiceSilence: boolean;
}
