import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceViewComponent } from './invoice-view.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule,MatChipsModule,  MatTabsModule,MatTooltipModule,MatDialogModule,MatProgressSpinnerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { InvoiceViewRoutingModule } from './invoice-view.routing';


@NgModule({
  imports: [
    CommonModule,
    InvoiceViewRoutingModule,MatProgressSpinnerModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatTabsModule,PageHeaderModule,
    BreadcrumbsModule,
    MatButtonModule,
    MatTooltipModule, 
    MatDialogModule
  ],
  declarations: [
    InvoiceViewComponent
  ]
})
export class InvoiceViewModule { }
