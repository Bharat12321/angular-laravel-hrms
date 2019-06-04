<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->increments('id');    
            $table->string('itemname')->nullable();
            $table->string('itemcode')->nullable();
            $table->string('barcode')->nullable();
            $table->integer('item_category_id')->unsigned()->nullable();
            $table->integer('item_manufacturar_id')->unsigned()->nullable();
            $table->integer('item_shelf_id')->unsigned()->nullable();
            $table->integer('item_row_id')->unsigned()->nullable();
            $table->integer('item_col_id')->unsigned()->nullable();
            $table->integer('uom_id')->unsigned()->nullable();
            $table->integer('rol')->nullable();
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
        Schema::dropIfExists('items');
    }
}
