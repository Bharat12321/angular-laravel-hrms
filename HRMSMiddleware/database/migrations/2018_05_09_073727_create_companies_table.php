<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code')->unique(); 
            $table->string('name');
            $table->tinyInteger('type')->default(1);  //1-lead , 2 Company , 3 - supplier
            $table->string('address')->nullable();
            $table->string('reference')->nullable();
            $table->string('city')->nullable();
            $table->string('pin_code')->nullable();
            $table->Integer('country_id')->nullable();
            $table->string('person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('remarks')->nullable();
            $table->integer('owner_id')->nullable();
            $table->tinyInteger('status')->default(1); 
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('companies');
    }
}
