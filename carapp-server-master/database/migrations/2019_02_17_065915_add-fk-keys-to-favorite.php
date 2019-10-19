<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFkKeysToFavorite extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('favorite_lists', function (Blueprint $table) {
            //
            $table -> unsignedInteger('user_id');
            $table -> foreign('user_id')->references('id')->on('users');
            $table -> unsignedInteger('post_id');
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
        Schema::table('favorite_lists', function (Blueprint $table) {
            //
        });
    }
}
