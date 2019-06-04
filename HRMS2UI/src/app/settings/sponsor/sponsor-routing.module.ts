import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SponsorComponent } from './sponsor.component';

const routes: Routes = [
  {
    path: '',
    component: SponsorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsorRoutingModule { }
