import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
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
import { EmployeeRoutingModule } from './employee-routing.module';
import { ListModule } from '../../core/list/list.module';
import { EmployeeCreateUpdateModule } from './employee-create-update/employee-create-update.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
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
    EmployeeCreateUpdateModule,
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [EmployeeComponent],
  exports: [EmployeeComponent]
})
export class EmployeeModule { }
