import { Injectable } from '@angular/core';
import { get, set } from 'idb-keyval';
import { IFavouriteTalentBuild } from './IFavouriteTalentBuild';
import { BehaviorSubject, Observable } from 'rxjs';
import { HotsDB } from 'hots-gamedata';

const FAV_TALENT_BUILDS_KEY = '__talent-calculator__.favoriteTalents';

@Injectable({
  providedIn: 'root'
})
export class FavouriteTalentbuildsService {

  private favTalentBuilds: Promise<Map<string, IFavouriteTalentBuild>>;
  private buildsSubject: BehaviorSubject<IFavouriteTalentBuild[]> = new BehaviorSubject([]);
  constructor() {

  }

  private async initialize() {
    if (!this.favTalentBuilds) {
      let map = await get<Map<string, IFavouriteTalentBuild>>(FAV_TALENT_BUILDS_KEY);
      if(!map){
        map = new Map();
      }
      this.favTalentBuilds = Promise.resolve(map);
      this.buildsSubject.next(this.toFavList(map));
    }
    return await this.favTalentBuilds;
  }

  public get builds(): Observable<IFavouriteTalentBuild[]> {
    this.initialize();
    return this.buildsSubject.asObservable();
  }

  public async saveBuild(build: IFavouriteTalentBuild): Promise<void>{
    const builds = await this.initialize();
    if(!build.gameVersion){
      build.gameVersion = await (await (await HotsDB.getVersion('latest')).heroes).version;
    }
    builds.set(build.hero + '|' + build.build, build);
    await this.save();
  }

  public async deleteBuild(hero:string, build: string): Promise<void>{
    const builds = await this.initialize();
    if(builds){
      builds.delete(hero + '|' + build);
      await this.save();
    }
  }
  
  public async hasBuild(hero:string, build: string): Promise<boolean>{
    const builds = await this.initialize();
    if(builds){
      return builds.has(hero + '|' + build);
    }
    return false;
  }

  public async getBuild(hero:string, build: string): Promise<IFavouriteTalentBuild>{
    const builds = await this.initialize();
    if(builds){
      return builds.get(hero + '|' + build);
    }
    return undefined;
  }

  private toFavList(map: Map<string, IFavouriteTalentBuild>):IFavouriteTalentBuild[]{
    if(!map){
      return [];
    }
    return Array.from(map.values());
  }

  private async save(){
    const builds = await this.initialize();
    await set(FAV_TALENT_BUILDS_KEY, builds);
    this.buildsSubject.next(this.toFavList(builds));
  }
}
