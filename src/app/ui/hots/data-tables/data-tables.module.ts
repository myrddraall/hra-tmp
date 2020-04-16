import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScoreScreenTableComponent } from './score-screen-table/score-screen-table.component';
import { MatTableModule } from '@angular/material/table';
import { FancyHeaderCellComponent } from './fancy-table/fancy-header-cell/fancy-header-cell.component';
import { FancyHeroCellComponent } from './fancy-table/fancy-hero-cell/fancy-hero-cell.component';
import { IconsModule } from '../icons/icons.module';
import { FancyCellComponent } from './fancy-table/fancy-cell/fancy-cell.component';
import { AwardsModule } from '../awards/awards.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { TalentTableComponent } from './talent-table/talent-table.component';
import { TalentsModule } from '../talents/talents.module';


@NgModule({
  declarations: [ScoreScreenTableComponent, FancyHeaderCellComponent, FancyHeroCellComponent, FancyCellComponent, TalentTableComponent],
  exports: [ScoreScreenTableComponent, TalentTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    IconsModule,
    AwardsModule,
    ButtonsModule,
    TalentsModule
  ]
})
export class DataTablesModule { }
