import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayComponent } from './pay.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule,
    MatDatepickerModule,MAT_DATE_LOCALE,MatCardModule,
    MatNativeDateModule,MatFormFieldModule, MatDialogModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule ,MatTabsModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSelectModule
  ],
  declarations: [PayComponent],
  entryComponents: [PayComponent],
  exports: [PayComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PayModule {
}
