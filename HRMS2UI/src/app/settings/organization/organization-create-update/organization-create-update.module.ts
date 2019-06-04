import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationCreateUpdateComponent } from './organization-create-update.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule,MatFormFieldModule, MatDialogModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule ,MatTabsModule} from '@angular/material';

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
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule
  ],
  declarations: [OrganizationCreateUpdateComponent],
  entryComponents: [OrganizationCreateUpdateComponent],
  exports: [OrganizationCreateUpdateComponent]
})
export class OrganizationCreateUpdateModule {
}
