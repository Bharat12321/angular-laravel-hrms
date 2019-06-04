import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AttachmentComponent } from './attachment.component';

const routes: Routes = [
  {
    path: '',
    component: AttachmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttachmentRoutingModule { }
