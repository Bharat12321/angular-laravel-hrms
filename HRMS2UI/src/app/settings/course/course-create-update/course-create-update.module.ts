import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCreateUpdateComponent } from './course-create-update.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule,MAT_DATE_LOCALE,MatNativeDateModule,MatDatepickerModule,MatFormFieldModule, MatDialogModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule ,MatTabsModule} from '@angular/material';

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
    MatNativeDateModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTabsModule,
    MatSelectModule
  ],
  declarations: [CourseCreateUpdateComponent],
  entryComponents: [CourseCreateUpdateComponent],
  exports: [CourseCreateUpdateComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CourseCreateUpdateModule {
}
