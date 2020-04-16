import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { HeroModel2 } from 'hots-gamedata';
import { Router } from '@angular/router';

@Component({
  selector: 'hra-talent-build-link-copy-button',
  templateUrl: './talent-build-link-copy-button.component.html',
  styleUrls: ['./talent-build-link-copy-button.component.scss']
})
export class TalentBuildLinkCopyButtonComponent implements OnInit {

  @Input()
  public hero: HeroModel2;

  @Input()
  public label: string;

  @Input()
  @HostBinding('class.show-navigate')
  public showNavigate: boolean = false;

  @Input()
  @HostBinding('class.show-label')
  public showLabel: boolean = true;



  constructor(
    private readonly router: Router
  ) { }

  ngOnInit(): void {
  }

  public copyLink(input: HTMLInputElement) {
    const baseHref = document.querySelector('head > base').getAttribute('href');
    this.copy(input,
      location.protocol + '//' + location.host + 
      this.router.createUrlTree([baseHref, 'talent-calculator', this.hero.id, this.hero.talentBuildUrl]).toString()
    );
  }

  public navigateTo() {
    /*this.copy(input,
      location.protocol + '//' + location.host + 
      this.router.createUrlTree(['talent-calculator', this.hero.id, this.hero.talentBuildUrl]).toString()
    );*/
    this.router.navigate(['/talent-calculator', this.hero.id, this.hero.talentBuildUrl]);
  }


  public copyInGame(input: HTMLInputElement) {
    this.copy(input, this.hero.talentBuildIngameLink);
  }

  private copy(input: HTMLInputElement, value: string) {
    input.value = value;
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }
}
