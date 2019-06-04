import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { authRoutes } from './settings/auth/auth.routing';
import { AdminAuthGuard } from './settings/auth/services/admin-auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        loadChildren: 'app/dashboard/dashboard-statistics/dashboard-statistics.module#DashboardStatisticsModule',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard-statistics/dashboard-statistics.module#DashboardStatisticsModule',
        pathMatch: 'full'
      },
      {
        path: 'user/role',
        loadChildren: 'app/settings/user/role/role.module#RoleModule'
      },
      {
        path: 'user',
        loadChildren: 'app/settings/user/user/user.module#UserModule'
      },
      {
        path: 'setting/config/:id/:name',
        loadChildren: 'app/settings/config/setting/setting.module#SettingModule'
      },
      {
        path: 'setting/config-item',
        loadChildren: 'app/settings/config/config-item/config-item.module#ConfigItemModule'
      },
      {
        path: 'organization',
        loadChildren: 'app/settings/organization/organization.module#OrganizationModule'
      },
      {
        path: 'sponsor',
        loadChildren: 'app/settings/sponsor/sponsor.module#SponsorModule'
      },
      {
        path: 'bank',
        loadChildren: 'app/settings/bank/bank.module#BankModule'
      },
      {
        path: 'ledger',
        loadChildren: 'app/settings/ledger/ledger.module#LedgerModule'
      },
      {
        path: 'item',
        loadChildren: 'app/companies/item/item.module#ItemModule'
      },
      {
        path: 'employee',
        loadChildren: 'app/employees/employee/employee.module#EmployeeModule'
      },
      {
        path: 'employee/:type',
        loadChildren: 'app/employees/employee/employee.module#EmployeeModule'
      },
      {
        path: 'employee/profile/:id',
        loadChildren: 'app/employees/employees.module#EmployeesModule'
      },
      {
        path: 'payment/:type',
        loadChildren: 'app/payments/payment/payment.module#PaymentModule'
      },
      {
        path: 'sale/:type',
        loadChildren: 'app/sales/sale/sale.module#SaleModule'
      },
      {
        path: 'payment_category',
        loadChildren: 'app/payments/category/category.module#CategoryModule'
      },
      {
        path: 'company/:type',
        loadChildren: 'app/companies/company/company.module#CompanyModule'
      },
      {
        path: 'company/profile/:id',
        loadChildren: 'app/companies/companies.module#CompaniesModule'
      }
    ]
  },
  {
    path: 'auth',
    children: [
      ...authRoutes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
