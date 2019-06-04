<?php

use Dingo\Api\Routing\Router;

/** @var Router $api */
$api = app(Router::class);

$api->version('v1', function (Router $api) {
    $api->group(['prefix' => 'auth'], function(Router $api) {
        $api->post('signup', 'App\Api\V1\Core\Controllers\SignUpController@signUp');
        $api->post('login', 'App\Api\V1\Core\Controllers\LoginController@login');

        $api->post('recovery', 'App\Api\V1\Core\Controllers\ForgotPasswordController@sendResetEmail');
        $api->post('reset', 'App\Api\V1\Core\Controllers\ResetPasswordController@resetPassword');

        $api->post('logout', 'App\Api\V1\Core\Controllers\LogoutController@logout');
        $api->post('refresh', 'App\Api\V1\Core\Controllers\RefreshController@refresh');
        $api->get('me', 'App\Api\V1\Core\Controllers\UserController@me');
    });

    $api->group(['middleware' => 'jwt.auth'], function(Router $api) {
        $api->get('/dashboard/studentCountGraph', 'App\Api\V1\Core\Controllers\DashboardController@studentCountGraph');
        
        $api->resource('dashboard', 'App\Api\V1\Core\Controllers\DashboardController');


        $api->get('user/role/create', 'App\Api\V1\Core\Controllers\RoleController@create');
        $api->get('user/role/update/{id}', 'App\Api\V1\Core\Controllers\RoleController@edit');
        $api->resource('user/role', 'App\Api\V1\Core\Controllers\RoleController');

        $api->get('user/createupdate', 'App\Api\V1\Core\Controllers\UserController@create');
        $api->patch('user/changePassword', 'App\Api\V1\Core\Controllers\UserController@changePassword');

        $api->resource('user', 'App\Api\V1\Core\Controllers\UserController');

        $api->get('config_item/config/{id}', 'App\Api\V1\Core\Controllers\ConfigItemController@getConfig');
        $api->resource('config_item', 'App\Api\V1\Core\Controllers\ConfigItemController');

        $api->resource('config', 'App\Api\V1\Core\Controllers\ConfigController');

        $api->resource('bank', 'App\Api\V1\Core\Controllers\BankController');

        $api->resource('profile', 'App\Api\V1\Core\Controllers\ProfileController');

        $api->resource('sponsor', 'App\Api\V1\Core\Controllers\SponsorController');

        $api->get('course/createupdate', 'App\Api\V1\Core\Controllers\CourseController@create');
        $api->resource('course', 'App\Api\V1\Core\Controllers\CourseController');


        $api->get('organization_unit/createupdate', 'App\Api\V1\Core\Controllers\OrganizationUnitController@create');
        $api->resource('organization_unit', 'App\Api\V1\Core\Controllers\OrganizationUnitController');

        $api->get('employee/filter/{type}', 'App\Api\V1\Employees\Controllers\EmployeeController@search');
        $api->get('employee/createupdate', 'App\Api\V1\Employees\Controllers\EmployeeController@create');
        $api->resource('employee', 'App\Api\V1\Employees\Controllers\EmployeeController');
        $api->patch('employee/user/{id}', 'App\Api\V1\Employees\Controllers\EmployeeController@user');
        $api->get('employee/attachment/{id}', 'App\Api\V1\Employees\Controllers\EmployeeIdController@employee');
        $api->get('employee/activity/{id}', 'App\Api\V1\Employees\Controllers\EmployeeActivityController@employee');
        
        $api->get('company/filter/{type}', 'App\Api\V1\Companies\Controllers\CompanyController@search');
        $api->get('company/createupdate', 'App\Api\V1\Companies\Controllers\CompanyController@create');
        $api->get('company/payment/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@payment');
        $api->get('company/invoice/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@invoice');
        $api->get('company/quotation/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@quotation');
        $api->get('company/lpo/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@lpo');
        $api->get('company/invoice/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@invoice');
        $api->post('company/invoice/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@invoiceFee');
        $api->patch('company/user/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@user');
        $api->patch('company/updateType/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@updateType');
        $api->get('company/attachment/{id}', 'App\Api\V1\Employees\Controllers\EmployeeIdController@company');
        $api->get('company/activity/{id}', 'App\Api\V1\Employees\Controllers\EmployeeActivityController@company');

        //$api->get('company/student/{id}', 'App\Api\V1\Students\Controllers\StudentController@company');

        $api->get('company/createupdate', 'App\Api\V1\Companies\Controllers\CompanyController@create');
        $api->get('company/type/{id}', 'App\Api\V1\Companies\Controllers\CompanyController@type');
        $api->resource('company', 'App\Api\V1\Companies\Controllers\CompanyController');

        $api->get('company_course/createupdate', 'App\Api\V1\Companies\Controllers\CompanyCourseController@create');
        $api->get('company_course/company/{id}', 'App\Api\V1\Companies\Controllers\CompanyCourseController@company');
        $api->get('company_course/lead/{id}', 'App\Api\V1\Companies\Controllers\CompanyCourseController@lead');
        $api->post('company_course/quotation/{id}', 'App\Api\V1\Companies\Controllers\CompanyCourseController@quotation');
        $api->post('company_course/invoice/{id}', 'App\Api\V1\Companies\Controllers\CompanyCourseController@invoice');
        $api->resource('company_course', 'App\Api\V1\Companies\Controllers\CompanyCourseController');

        $api->get('lpo_item/createupdate', 'App\Api\V1\Companies\Controllers\CompanyLpoItemController@create');
        $api->get('lpo_item/company/{id}', 'App\Api\V1\Companies\Controllers\CompanyLpoItemController@company');
        $api->post('lpo_item/invoice/{id}', 'App\Api\V1\Companies\Controllers\CompanyLpoItemController@lpo');
        $api->resource('lpo_item', 'App\Api\V1\Companies\Controllers\CompanyLpoItemController');

        $api->resource('ledger', 'App\Api\V1\Accounts\Controllers\LedgerController');


        $api->get('payment/filter/{type}', 'App\Api\V1\Accounts\Controllers\PaymentController@search');
        $api->get('payment/createupdate', 'App\Api\V1\Accounts\Controllers\PaymentController@create');
        $api->resource('payment', 'App\Api\V1\Accounts\Controllers\PaymentController');

        $api->get('sale/filter/{type}', 'App\Api\V1\Sales\Controllers\SaleController@search');
        $api->get('sale/createupdate', 'App\Api\V1\Sales\Controllers\SaleController@create');
        $api->patch('sale/pay/{id}', 'App\Api\V1\Sales\Controllers\SaleController@pay');
        $api->patch('sale/getstock/{id}', 'App\Api\V1\Sales\Controllers\SaleController@getstock');
        $api->resource('sale', 'App\Api\V1\Sales\Controllers\SaleController');

        $api->get('invoice/student/{id}', 'App\Api\V1\Accounts\Controllers\InvoiceController@student');
        $api->get('invoice/company/{type}/{id}', 'App\Api\V1\Accounts\Controllers\InvoiceController@company');
        $api->patch('invoice/payment/{id}', 'App\Api\V1\Accounts\Controllers\InvoiceController@invoicePay');
        $api->patch('quotation/approve/{id}', 'App\Api\V1\Accounts\Controllers\InvoiceController@approve');
        $api->resource('invoice', 'App\Api\V1\Accounts\Controllers\InvoiceController');

        $api->resource('payment_category', 'App\Api\V1\Accounts\Controllers\PaymentCategoryController');

       $api->get('attachment/createupdate', 'App\Api\V1\Employees\Controllers\EmployeeIdController@create');
        $api->post('attachment/{id}', 'App\Api\V1\Employees\Controllers\EmployeeIdController@updateFIle');
        $api->resource('attachment', 'App\Api\V1\Employees\Controllers\EmployeeIdController');

        $api->get('activity/createupdate', 'App\Api\V1\Employees\Controllers\EmployeeActivityController@create');
        $api->resource('activity', 'App\Api\V1\Employees\Controllers\EmployeeActivityController');

        $api->resource('service', 'App\Api\V1\Sales\Controllers\SeviceController');
        $api->get('services', 'App\Api\V1\Sales\Controllers\SeviceController@create');
        $api->resource('item','App\Api\V1\Sales\Controllers\ItemController');
        $api->get('item/createupdate', 'App\Api\V1\Sales\Controllers\ItemController@create');
        $api->get('items', 'App\Api\V1\Sales\Controllers\ItemController@create');
        $api->resource('purchase', 'App\Api\V1\Sales\Controllers\PurchaseController');
        $api->resource('package', 'App\Api\V1\Sales\Controllers\PackageController');
        $api->get('packages', 'App\Api\V1\Sales\Controllers\PackageController@create');
        $api->resource('gin', 'App\Api\V1\Sales\Controllers\GinController');
        $api->resource('grn', 'App\Api\V1\Sales\Controllers\GrnController');
        $api->resource('stock', 'App\Api\V1\Sales\Controllers\StockController');
        $api->get('stock', 'App\Api\V1\Sales\Controllers\StockController@create');
        $api->get('protected', function() {
            return response()->json([
                'message' => 'Access to protected resources granted! You are seeing this text as you provided the token correctly.'
            ]);
        });

        $api->get('refresh', [
            'middleware' => 'jwt.refresh',
            function() {
                return response()->json([
                    'message' => 'By accessing this endpoint, you can refresh your access token at each request. Check out this response headers!'
                ]);
            }
        ]);
    });

    $api->get('hello', function() {
        return response()->json([
            'message' => 'This is a simple example of item returned by your APIs. Everyone can see it.'
        ]);
    });


});
