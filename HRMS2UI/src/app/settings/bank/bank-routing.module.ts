import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BankComponent } from './bank.component';

const routes: Routes = [
  {
    path: '',
    component: BankComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
