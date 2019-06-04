import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleComponent } from './sale.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
    MatDatepickerModule,MAT_DATE_LOCALE,
    MatNativeDateModule,MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule, 
  MatProgressSpinnerModule,
  MatTableModule,
  MatCardModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { SaleRoutingModule } from './sale-routing.module';
import { ListModule } from '../../core/list/list.module';
import { SaleCreateUpdateModule } from './sale-create-update/sale-create-update.module';
import { PayModule } from './pay/pay.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';
import { ReceiptViewModule } from './receipt-view/receipt-view.module';
// import {} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    SaleRoutingModule,
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
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule, 
    MatDialogModule,
    MatCardModule,

    // Core
    ListModule,
    SaleCreateUpdateModule,ReceiptViewModule,PayModule,
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [SaleComponent],
  exports: [SaleComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SaleModule { }
