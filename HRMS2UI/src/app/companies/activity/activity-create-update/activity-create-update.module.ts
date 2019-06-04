import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCreateUpdateComponent } from './activity-create-update.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule,MatFormFieldModule,MAT_DATE_LOCALE,MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule ,MatTabsModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,MatDatepickerModule, MatNativeDateModule,
    MatTabsModule,
    MatSelectModule
  ],
  declarations: [ActivityCreateUpdateComponent],
  entryComponents: [ActivityCreateUpdateComponent],
  exports: [ActivityCreateUpdateComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ActivityCreateUpdateModule {
}
