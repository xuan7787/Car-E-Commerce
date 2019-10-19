<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsToCarListing extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('car_listings', function (Blueprint $table) {
            //
            $table->tinyInteger('owners');
            $table->dateTime('manufactured');
            $table->double('omv');
            $table->double('arf');
            $table->double('deregistration_val');
            $table->double('bhp');
            $table->double('engine_capacity');
            $table->double('road_tax');
            $table->timestamps();
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
