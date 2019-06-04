import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LPOComponent } from './lpo.component';

const routes: Routes = [
  {
    path: '',
    component: LPOComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LPORoutingModule { }
