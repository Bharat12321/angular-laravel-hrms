import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenderWidgetComponent } from './gender-widget.component';
import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  declarations: [GenderWidgetComponent],
  exports: [GenderWidgetComponent]
})
export class GenderWidgetModule { }
