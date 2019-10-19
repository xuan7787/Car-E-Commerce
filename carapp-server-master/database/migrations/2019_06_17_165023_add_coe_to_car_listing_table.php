<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCoeToCarListingTable extends Migration
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
            $table->string('plate_number');
            $table->double('coe');
            $table->dateTime('coe_expiry_date');
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
