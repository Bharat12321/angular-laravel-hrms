import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { NoAccessComponent } from './no-access/no-access.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    LoginModule,
    RegisterModule,
    ForgotPasswordModule
  ],
  declarations: [
    NotFoundComponent,
    NoAccessComponent
  ],
})
export class AuthModule { }
