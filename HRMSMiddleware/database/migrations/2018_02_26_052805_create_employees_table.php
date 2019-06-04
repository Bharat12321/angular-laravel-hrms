<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code')->unique();
            $table->string('name');
            $table->string('arabic_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender');
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->date('joining_date');
            $table->integer('country_id')->unsigned()->nullable();
            $table->integer('joining_type_id')->unsigned()->nullable();
            $table->integer('type_id')->unsigned()->nullable();
            $table->integer('organization_id')->unsigned()->nullable();
            $table->integer('class_id')->unsigned()->nullable();
            $table->integer('department_id')->unsigned()->nullable();
            $table->integer('designation_id')->unsigned()->nullable();
            $table->integer('category_id')->unsigned()->nullable();
            $table->integer('grade_id')->unsigned()->nullable();
            $table->integer('bank_id')->unsigned()->nullable();
            $table->string('account_number')->nullable();
            $table->string('iban')->nullable();
            $table->integer('sponsor_id')->unsigned()->nullable();
            $table->integer('working_status_id')->unsigned()->nullable();
            $table->integer('payroll_center_id')->unsigned()->nullable();
            $table->tinyInteger('status')->default(1);
            $table->longText('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('country_id')->references('id')->on('countries')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
}
