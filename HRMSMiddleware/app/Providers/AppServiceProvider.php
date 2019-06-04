<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\Accounts\Ledger;
use App\Models\Sales\Sale;
use App\Models\Employees\Employee;
use App\Models\Companies\Company;
use App\Models\Sales\Purchase;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
          Relation::morphMap([
              'Employee' => Employee::class,
              'Company' => Company::class,
              'Ledger' => Ledger::class,
              'Sale' => Sale::class,
              'Purchase' => Purchase::class,
          ]);

    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
