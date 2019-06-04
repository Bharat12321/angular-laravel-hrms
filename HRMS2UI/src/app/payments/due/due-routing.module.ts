import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DueComponent } from './due.component';

const routes: Routes = [
  {
    path: '',
    component: DueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DueRoutingModule { }
