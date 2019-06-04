<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->increments('id');
            $table->morphs('taggable');
            $table->string('address');
            $table->string('fees');
            $table->date('date');
            $table->date('due_date');
            $table->float('total',9,2);
            $table->float('paid',9,2);
            $table->string('remarks')->nullable();
            $table->tinyInteger('type')->default(1); // 1 - quotation , 2 - invoice , 3 - lpo 
            $table->tinyInteger('status')->default(1);
            $table->timestamps();
        });
        //DB::statement("ALTER SEQUENCE invoices_id_seq RESTART 10001;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invoices');
    }
}
