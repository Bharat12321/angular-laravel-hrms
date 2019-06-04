<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGinDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gin_details', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('gin_id')->unsigned();
            $table->integer('item_id')->unsigned()->nullable();
            $table->integer('uom')->unsigned()->nullable();
            $table->float('quantity', 9, 2)->nullable();
         
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('gin_id')->references('id')->on('gin')->onUpdate('cascade')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gin_details');
    }
}
