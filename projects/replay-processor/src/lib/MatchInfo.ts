import { WebWorker, RunOnWorker, Proxy, OnWorker } from 'angular-worker-proxy';
import { ReplayWorker } from './ReplayWorker';
import { PlayerInfo } from './PlayerInfo';

@WebWorker('HotsReplay/MatchInfo')
export class MatchInfo {

    @Proxy()
    public playerInfo: PlayerInfo = new PlayerInfo(this);

    @OnWorker()
    public someValue:Promise<any> = new Promise((res)=>{
        setTimeout(()=>{
            res('hello delay!')
        }, 1000)
    });


    constructor(replay: any) {
       
    }

    @RunOnWorker()
    public async test(text:string) {
        const str = 'MatchInfo.test ' + text;
        console.log('in', str)
        return str;
    }

    @RunOnWorker()
    public async test2(text:string) {
        const tt = await this.playerInfo.test(text);
        const str = 'MatchInfo.test ' + text + '  ' + tt;
        console.log('in', str)
        return str;
    }
}