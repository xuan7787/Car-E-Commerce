<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFkPostIdToAccessories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accessories_imgs', function (Blueprint $table) {
            //
            $table ->unsignedInteger('post_id');
            $table -> foreign('post_id')->references('id')->on('car_listings');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('accessories_imgs', function (Blueprint $table) {
            //
        });
    }
}
