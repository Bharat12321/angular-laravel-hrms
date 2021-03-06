<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePurchaseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('company_id')->unsigned()->nullable();
            $table->integer('organization_id')->unsigned()->nullable();
            $table->integer('pono')->unsigned()->nullable();
            $table->date('date')->nullable();
            $table->string('name')->nullable();
            $table->float('discount', 9, 2)->nullable();
            $table->float('total', 9, 2)->nullable();
            $table->float('sub_total', 9, 2)->nullable();
            $table->float('paid_amount', 9, 2)->nullable();
            $table->float('due_amount', 9, 2)->nullable();
            $table->float('vat', 9, 2)->nullable();
            $table->string('payment_type')->nullable();
            $table->string('payment_mode')->nullable();
            $table->string('chequeno')->nullable();
            $table->date('chqdate')->nullable();
            $table->string('remarks')->nullable();
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
        Schema::dropIfExists('purchase');
    }
}
