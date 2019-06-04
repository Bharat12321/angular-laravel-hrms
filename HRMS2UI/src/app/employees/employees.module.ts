import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTabsModule ,MatProgressSpinnerModule,MatSlideToggleModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ScrollbarModule } from '../core/scrollbar/scrollbar.module';
import { EmployeesRoutingModule } from './employees.routing';
import { BreadcrumbsModule } from '../core/breadcrumbs/breadcrumbs.module';
import { PageHeaderModule } from '../core/page-header/page-header.module';

import { AttachmentModule } from './attachment/attachment.module';
import { ActivityModule } from './activity/activity.module';
@NgModule({
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatTabsModule,
    PageHeaderModule,
    BreadcrumbsModule,
    MatButtonModule,MatProgressSpinnerModule,
    ScrollbarModule,MatSlideToggleModule,

AttachmentModule,ActivityModule,
    /*SalaryModule,
    AttendanceModule*/
  ],
  declarations: [
    EmployeesComponent
  ]
})
export class EmployeesModule { }
