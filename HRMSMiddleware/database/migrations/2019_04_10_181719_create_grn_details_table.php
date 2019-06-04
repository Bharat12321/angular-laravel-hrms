<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGrnDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grn_details', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('grn_id')->unsigned();
            $table->integer('item_id')->unsigned()->nullable();
            $table->integer('uom')->unsigned()->nullable();
            $table->float('quantity', 9, 2)->nullable();
            $table->float('price', 9, 2)->nullable();
            $table->float('selling_price', 9, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('grn_id')->references('id')->on('grn')->onUpdate('cascade')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grn_details');
    }
}
