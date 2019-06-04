import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigItemComponent } from './config-item.component';
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
import { ConfigItemRoutingModule } from './config-item-routing.module';
import { FormsModule } from '@angular/forms';
import { ListModule } from '../../../core/list/list.module';
import { PageHeaderModule } from '../../../core/page-header/page-header.module';
import { BreadcrumbsModule } from '../../../core/breadcrumbs/breadcrumbs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ConfigItemRoutingModule,
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
    PageHeaderModule,
    BreadcrumbsModule
  ],
  declarations: [ConfigItemComponent],
  exports: [ConfigItemComponent]
})
export class ConfigItemModule { }
