import { Replay } from '../Replay';

export abstract class ReplayParser<TReport>{

    constructor(protected replay: Replay) { }

    public abstract parse(...args: any[]): Promise<TReport>

}