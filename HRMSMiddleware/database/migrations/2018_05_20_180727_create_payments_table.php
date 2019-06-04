<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('category_id')->unsigned();
            $table->string('taggable_type')->nullable();
            $table->integer('taggable_id')->unsigned()->nullable();
            $table->float('amount_payable', 9, 2);
            $table->float('amount_paid', 9, 2);
            $table->integer('type_id')->unsigned(); // 1 - income , 2 -expense
            $table->integer('mode_id')->unsigned()->nullable(); 
            $table->string('reference')->nullable();
            $table->date('payment_date')->nullable();
            $table->date('paid_date')->nullable();
            $table->string('remarks')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('category_id')->references('id')->on('payment_categories')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->index(['taggable_type', 'taggable_id','type_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
