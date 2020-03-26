import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHeroListItem } from 'hots-gamedata';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-talent-calculator',
  templateUrl: './talent-calculator.component.html',
  styleUrls: ['./talent-calculator.component.scss']
})
export class TalentCalculatorComponent implements OnInit {

  private _mode: 'icon' | 'tile' = 'tile';
  public modeChanged:BehaviorSubject<'icon' | 'tile'> = new BehaviorSubject('tile');

  public get heroList(): IHeroListItem[] {
    return this.route.snapshot.data.heroList;
  }
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit(): void {

  }

  public get mode(): 'icon' | 'tile' {
    return this._mode;
  }

  public set mode(value: 'icon' | 'tile') {
    if(this.mode !== value){
      this._mode =  value;
      this.modeChanged.next(value);
    }else{
      this._mode =  value;
    }
  }

  public get selectedHeroId(): string {
    return this.route.snapshot.firstChild.params.heroId;
  }

  public onHeroSelect(heroId: string) {
    if (heroId && heroId !== this.selectedHeroId) {
      this.router.navigate([heroId], { relativeTo: this.route });
    }
  }

}
