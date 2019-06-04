import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
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
import { CourseRoutingModule } from './course-routing.module';
import { ListModule } from '../../core/list/list.module';
import { CourseCreateUpdateModule } from './course-create-update/course-create-update.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PageHeaderModule } from '../../core/page-header/page-header.module';
import { BreadcrumbsModule } from '../../core/breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    CourseRoutingModule,
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
    CourseCreateUpdateModule,InvoiceModule,
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [CourseComponent],
  exports: [CourseComponent]
})
export class CourseModule { }
