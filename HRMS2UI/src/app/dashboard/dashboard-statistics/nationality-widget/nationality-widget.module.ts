import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NationalityWidgetComponent } from './nationality-widget.component';
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
  declarations: [NationalityWidgetComponent],
  exports: [NationalityWidgetComponent]
})
export class NationalityWidgetModule { }
