import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LPOComponent } from './lpo.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule, 
  MatProgressSpinnerModule,
  MatTableModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { LPORoutingModule } from './lpo-routing.module';
import { ListModule } from '../../core/list/list.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { LPOViewModule } from './lpo-view/lpo-view.module';
import { PayModule } from './pay/pay.module';
import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    LPORoutingModule,
    FormsModule,
    FlexLayoutModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule, 
    MatProgressSpinnerModule,
    MatTooltipModule, LPOViewModule, PayModule,
    MatDialogModule,

    // Core
    ListModule,
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [LPOComponent],
  exports: [LPOComponent]
})
export class LPOModule { }
