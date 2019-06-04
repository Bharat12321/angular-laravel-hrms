import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
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
import { SettingRoutingModule } from './setting-routing.module';
import { ListModule } from '../../../core/list/list.module';
import { SettingCreateUpdateModule } from './setting-create-update/setting-create-update.module';
import { PageHeaderModule } from '../../../core/page-header/page-header.module';
import { BreadcrumbsModule } from '../../../core/breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
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
    SettingCreateUpdateModule,
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [SettingComponent],
  exports: [SettingComponent]
})
export class SettingModule { }
