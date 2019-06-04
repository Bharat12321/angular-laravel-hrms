import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationComponent } from './quotation.component';
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
import { QuotationRoutingModule } from './quotation-routing.module';
import { ListModule } from '../../core/list/list.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { QuotationViewModule } from './quotation-view/quotation-view.module';
import { PayModule } from './pay/pay.module';
import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    QuotationRoutingModule,
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
    MatTooltipModule, QuotationViewModule, PayModule,
    MatDialogModule,

    // Core
    ListModule,
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [QuotationComponent],
  exports: [QuotationComponent]
})
export class QuotationModule { }
