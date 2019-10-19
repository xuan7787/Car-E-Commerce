<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFksToCarListing extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('car_listings', function (Blueprint $table) {
            $table->unsignedInteger('type');
            $table->foreign('type')->references('id')->on('types');
            $table->unsignedInteger('make');
            $table->foreign('make')->references('id')->on('brands');
            $table->unsignedInteger('transmission');
            $table->foreign('transmission')->references('id')->on('transmissions');
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
