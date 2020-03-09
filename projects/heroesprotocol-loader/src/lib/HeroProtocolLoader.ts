import { IHeroProtocol } from 'heroesprotocol-data';
import { PythonProtocolConverter } from './converter/PythonProtocolConverter';


const BASE_PROTOCOL = 29406;

export class HeroProtocolLoader {

    private static _protocolsByVersion: Map<number, IHeroProtocol> = new Map();

    public static async getProtocol(protocolVersion: number = BASE_PROTOCOL): Promise<IHeroProtocol> {

        if (HeroProtocolLoader._protocolsByVersion.has(protocolVersion)) {
            return HeroProtocolLoader._protocolsByVersion.get(protocolVersion);
        }
        const pyCode = await HeroProtocolLoader.loadProtocol(protocolVersion);
        const protocol = PythonProtocolConverter.compile(pyCode);
        HeroProtocolLoader._protocolsByVersion.set(protocolVersion, protocol);
        return protocol;
    }

    private static async loadProtocol(protocolVersion: number): Promise<string> {
        const url = `https://raw.githubusercontent.com/Blizzard/heroprotocol/master/protocol${protocolVersion}.py`;

        const response = await fetch(url, {
            method: 'GET'
        });
        if (response.ok) {
            return HeroProtocolLoader.convertProtocolFromPython(protocolVersion, await response.text());
        } else {
            throw new Error(response.statusText);
        }

    }

    private static convertProtocolFromPython(protocolVersion: number, pyCode: string): string {
        const converter = new PythonProtocolConverter(protocolVersion, pyCode);
        return converter.getCode();
    }

}