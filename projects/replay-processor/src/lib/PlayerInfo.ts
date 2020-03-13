import { WebWorker, RunOnWorker, RunOnMain } from 'angular-worker-proxy';
import { ReplayWorker } from './ReplayWorker';

@WebWorker('HotsReplay/PlayerInfo')
export class PlayerInfo {

    constructor(replay: any) {
       
    }

    @RunOnWorker()
    public async test(text) {
        const tt = await this.test2(text + 'rrr');
        const str = 'PlayerInfo.test ' + text + ' ' +  tt;
        console.log('in', str)
        return str;
    }

    @RunOnMain()
    public async test2(text) {
        const str = 'PlayerInfo.test2 ' + text;
        console.log('in', str)
        return str;
    }
}