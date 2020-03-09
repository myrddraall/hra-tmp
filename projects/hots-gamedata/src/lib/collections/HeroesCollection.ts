import { Collection } from './Collection';

export class HeroesCollection extends Collection<any>{


    public async getHeroIds():Promise<string[]>{
            return null;
    }

    public async initialize(): Promise<void>{
       console.log('init hero collecction')
        return null;
    }
}