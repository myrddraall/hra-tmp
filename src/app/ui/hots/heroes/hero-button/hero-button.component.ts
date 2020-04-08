import { Input } from '@angular/core';
import { HeroicButtonBaseComponent } from '../../buttons/heroic-button-base/heroic-button-base.component';

export abstract class HeroButtonComponent extends HeroicButtonBaseComponent {
  @Input()
  private ___a;

  public get iconUrl(): string {
    return !this.hero ? '' : `${this.basePath}/${this.hero.portraits.target}`;
  }

}
