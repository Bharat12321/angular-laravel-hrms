import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
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
import { InvoiceRoutingModule } from './invoice-routing.module';
import { ListModule } from '../../core/list/list.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { InvoiceViewModule } from './invoice-view/invoice-view.module';
import { PayModule } from './pay/pay.module';
import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    InvoiceRoutingModule,
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
    MatTooltipModule, InvoiceViewModule, PayModule,
    MatDialogModule,

    // Core
    ListModule,
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [InvoiceComponent],
  exports: [InvoiceComponent]
})
export class InvoiceModule { }
