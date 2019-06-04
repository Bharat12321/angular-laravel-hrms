import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTabsModule ,MatProgressSpinnerModule,MatSlideToggleModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ScrollbarModule } from '../core/scrollbar/scrollbar.module';
import { CompaniesRoutingModule } from './companies.routing';
import { BreadcrumbsModule } from '../core/breadcrumbs/breadcrumbs.module';
import { PageHeaderModule } from '../core/page-header/page-header.module';

import { CourseModule } from './course/course.module';
import { LPOModule } from './lpo/lpo.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';
import { ActivityModule } from './activity/activity.module';
import { AttachmentModule } from './attachment/attachment.module';
import { ContactModule } from './contact/contact.module';
import { LineModule } from './line/line.module';
import { ItemModule } from './item/item.module';
import { QuotationModule } from './quotation/quotation.module';

@NgModule({
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatTabsModule,
    PageHeaderModule,
    BreadcrumbsModule,
    MatButtonModule,MatProgressSpinnerModule,
    ScrollbarModule,MatSlideToggleModule,PaymentModule,LPOModule,ItemModule,

    // Companiess
    InvoiceModule,
    AttachmentModule,ActivityModule,ContactModule,LineModule,QuotationModule,
    CourseModule
  ],
  declarations: [
    CompaniesComponent
  ]
})
export class CompaniesModule { }
