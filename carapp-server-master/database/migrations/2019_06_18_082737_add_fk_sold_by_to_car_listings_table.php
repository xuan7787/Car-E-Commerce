<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFkSoldByToCarListingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('car_listings', function (Blueprint $table) {
          $table ->unsignedInteger('sold_by');
          $table -> foreign('sold_by')->references('id')->on('sold_types');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('car_listings', function (Blueprint $table) {
            //
        });
    }
}
