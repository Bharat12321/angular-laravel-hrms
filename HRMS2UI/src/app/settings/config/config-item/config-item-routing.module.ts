import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConfigItemComponent } from './config-item.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigItemComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigItemRoutingModule { }
