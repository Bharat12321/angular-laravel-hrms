import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageComponent } from './package.component';
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
import { PackageRoutingModule } from './package-routing.module';
import { ListModule } from '../../core/list/list.module';
import { PackageCreateUpdateModule } from './package-create-update/package-create-update.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    PackageRoutingModule,
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
    MatTooltipModule, 
    MatDialogModule,

    // Core
    ListModule,
    PackageCreateUpdateModule,InvoiceModule,
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [PackageComponent],
  exports: [PackageComponent]
})
export class PackageModule { }
