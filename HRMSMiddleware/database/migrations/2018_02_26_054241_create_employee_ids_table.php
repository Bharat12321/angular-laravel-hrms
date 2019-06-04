<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeeIdsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_ids', function (Blueprint $table) {
            $table->increments('id');
            $table->morphs('taggable');
            $table->integer('type_id')->unsigned();
            $table->string('number')->nullable();
            $table->string('location')->nullable();
            $table->date('expiry_date')->nullable();
            $table->longText('remarks')->nullable();
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
        Schema::dropIfExists('employee_ids');
    }
}
