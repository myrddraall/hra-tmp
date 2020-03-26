import { Component, OnInit, OnChanges, HostBinding } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, } from '@angular/router';
import { IHero, ITalent, HeroModel } from 'hots-gamedata';
import { HeroStringsUtil } from 'hots-gamedata';
import { TalentCalculatorComponent } from '../../talent-calculator.component';

@Component({
  selector: 'app-hero-talent-selector',
  templateUrl: './hero-talent-selector.component.html',
  styleUrls: ['./hero-talent-selector.component.scss']
})
export class HeroTalentSelectorComponent implements OnInit, OnChanges {
  public _selectedTalents = {
    '1': -1,
    '4': -1,
    '7': -1,
    '10': -1,
    '13': -1,
    '16': -1,
    '20': -1,
  }
  private _hero: HeroModel;

  public _selectedValue: number = 0;
  // public _selectedValue: number;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly parent: TalentCalculatorComponent
  ) {
    parent.modeChanged.subscribe((value)=>{
      this.displayMode = value;
    });
    this.route.data.subscribe(data => {
      if (this._hero?.id !== data.hero.id) {
        this._hero = new HeroModel(data.hero);
        this.update();
     }
    });
    this.route.params.subscribe(params => {
      if(this._hero){
        this.update();
      }
    })
  }

  @HostBinding('attr.display-mode')
  public displayMode: 'icon' | 'tile' = 'icon';

  public get hero(): HeroModel {
    return this._hero;
  }
  public get base64(): string {
    return this._selectedValue.toString(36);
  }


  public get bgUrl(): string {
    if(!this._hero){
      return '';
    }
    const nName = HeroStringsUtil.normalizeStringNoSpace(this.hero.name, '-').toLowerCase();
    const nTtite = HeroStringsUtil.normalizeStringNoSpace(this.hero.title, '-').toLowerCase();
    if (nName === 'valeera') {
      return `https://static.heroesofthestorm.com/heroes/${nName}/skins/standard/${nTtite}.jpg`
    }
    if (nName === 'cho' || nName === 'gall' || nName === 'greymane') {
      return `https://static.heroesofthestorm.com/heroes/${nName}/skins/${nName}/${nTtite}.jpg`
    }
    return `https://static.heroesofthestorm.com/heroes/${nName}/skins/${nTtite}.jpg`
  }
  ngOnInit() {
    const base36 = this.route.snapshot.params.selectedTalents || '';
    this._selectedValue = parseInt(base36, 36) || 0;
    this._selectedTalents = {
      '1': -1,
      '4': -1,
      '7': -1,
      '10': -1,
      '13': -1,
      '16': -1,
      '20': -1,
    };
    this.updateSelected();
  }


  public update(): void {
    const base36 = this.route.snapshot.params.selectedTalents || '';
    this._selectedValue = parseInt(base36, 36) || 0;
    this._selectedTalents = {
      '1': -1,
      '4': -1,
      '7': -1,
      '10': -1,
      '13': -1,
      '16': -1,
      '20': -1,
    };
    this.updateSelected();
  }

  ngOnChanges(changes): void {
    if (changes.hero) {
      this.update();
    }
  }

  selectTalent(tier: string, index: number) {
    if(this._selectedTalents[tier] === index){
      return;
    }

    const talent = this._hero.talents['level' + tier][index];
    const prevTalent = this._hero.talents['level' + tier][this._selectedTalents[tier]];
 
  
   

    console.log(prevTalent, talent);

    // deselect any talents that had the previously selected talent as a requirement
    if(prevTalent){
      const dependantTalents = this._hero.findTalents(t => {
        if(!t.prerequisiteTalentIds || t.prerequisiteTalentIds.indexOf(prevTalent.id) === -1){
          return false;
        }
        return true;
      });
      for (const dtalent of dependantTalents) {
        const dtier = dtalent.tier;
        const didx = dtalent.sort - 1;
        if(this._selectedTalents[dtier] === didx){
          this._selectedTalents[dtier] = -1;
        }
      }
    }
    // select the talent
    this._selectedTalents[tier] = index;
 
    // select talents required by this talent
    if(talent.prerequisiteTalentIds){
      for (const id of talent.prerequisiteTalentIds) {
       const preTalent = this._hero.findTalentById(id);
       this.selectTalent(preTalent.tier.toString(), preTalent.sort-1);
      }
    }

    this.updateValue();
  }

  getSelected(tier: string) {
    return this._selectedTalents[tier];
  }

  isSelected(tier: string, index: number) {
    return this._selectedTalents[tier] === index;
  }

  private updateSelected() {
    if (this.hero) {
      let i = 0;
      for (const key in this._selectedTalents) {
        if (this._selectedTalents.hasOwnProperty(key)) {
          let tierIdx = 0;
          for (const talent of this.hero.talents['level' + key]) {
            const talentFlag = 1 << i;
            if ((this._selectedValue & talentFlag) === talentFlag) {
              this._selectedTalents[key] = tierIdx;
            }
            tierIdx++;
            i++;
          }
        }
      }
    }
  }
  private updateValue() {
    if (this.hero) {
      this._selectedValue = 0;
      let i = 0;
      for (const key in this._selectedTalents) {
        if (this._selectedTalents.hasOwnProperty(key)) {
          const selectedIndex = this._selectedTalents[key];
          let tierIdx = 0;
          for (const talent of this.hero.talents['level' + key]) {
            if (selectedIndex === tierIdx) {
              this._selectedValue += 1 << i;
            }
            tierIdx++;
            i++;
          }
        }
      }
      const path = this.router.createUrlTree(['/talent-calculator', this.hero.id, this.base64]);
      this.location.go(path.toString())
    }
    /*for (let i = 0; i < this.hero.talents.length; i++) {
      const element = this.hero.talents[i];
      
    }*/
  }
}
