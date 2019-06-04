import { AuthHttp, AUTH_PROVIDERS, provideAuth, AuthConfig } from 'angular2-jwt/angular2-jwt';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { AdminAuthGuard } from './settings/auth/services/admin-auth-guard.service';
import { AuthGuard } from './settings/auth/services/auth-guard.service';
import { MockBackend } from '@angular/http/testing';
import { AuthService } from './settings/auth/services/auth.service';
import { DataService } from './services/data.service';
import { AppErrorHandler } from './common/app-error-handler';
import { DateAdapter } from '@angular/material';

import { MY_DATE_FORMATS } from './core/dateformat/my_date_format';
import { MyDateAdapter } from './core/dateformat/my_native_adaptor';


import { BrowserModule } from '@angular/platform-browser';
import { NgModule , ErrorHandler } from '@angular/core';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SettingsModule } from './settings/settings.module';
import { EmployeesModule } from './employees/employees.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentsModule } from './payments/payments.module';
import { CompaniesModule } from './companies/companies.module';
import { SalesModule } from './sales/sales.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AgmCoreModule } from '@agm/core';
import { RouteHandlerModule } from './core/route-handler/route-handler.module';
import { HttpClientModule } from '@angular/common/http';
import { SaleService } from './services/sale.service';


export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'token'
  }), http);
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'hrms' }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar : true,
      maxOpened : 5,
      autoDismiss: true,
      progressAnimation : 'increasing',
    }), 
    HttpClientModule,
    StoreModule.forRoot(reducers),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    EffectsModule.forRoot([]),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
    }),
    AppRoutingModule,
    CoreModule,
    SettingsModule,
    EmployeesModule,
    DashboardModule,
    PaymentsModule,SalesModule,
    HttpModule,CompaniesModule,
    RouteHandlerModule
  ],
  providers: [
    AuthService,
    DataService,
    SaleService,
    AuthGuard,
    AdminAuthGuard,
    AuthHttp,
    //{provide: DateAdapter, useClass: MyDateAdapter},
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    {provide:ErrorHandler , useClass : AppErrorHandler}
    ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
