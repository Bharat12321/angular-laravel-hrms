import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
