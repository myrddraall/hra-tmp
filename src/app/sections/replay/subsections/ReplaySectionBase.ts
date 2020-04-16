import { ActivatedRoute } from '@angular/router';
import { ReplayWorker } from 'replay-processor';

export abstract class ReplaySectionBase {
    private _replay:ReplayWorker;

    constructor(
        protected readonly activeRoute: ActivatedRoute,
    ) {
        this.activeRoute.parent.parent.parent.parent.data.subscribe((data)=>{
            if(this._replay !== data.replay){
                this._replay = data.replay;
                this.onReplayUpdate();
            }
        });

     }

    protected get replay(): ReplayWorker {
        return this._replay;
    }

    protected abstract onReplayUpdate():void | Promise<void>;

}