<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePackagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('packages',function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->integer('package_category_id')->unsigned()->nullable();
            $table->string('description')->nullable();
            $table->float('price', 9, 2)->nullable();  
            $table->float('sessions', 9, 2)->nullable();          
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
        Schema::dropIfExists('packages');
    }
}
