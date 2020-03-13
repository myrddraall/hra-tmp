import { ReplayWorker } from '../ReplayWorker';

export abstract class ReplayParser<TReport>{

    constructor(protected replay: ReplayWorker) { }

    public abstract parse(...args: any[]): Promise<TReport>

}