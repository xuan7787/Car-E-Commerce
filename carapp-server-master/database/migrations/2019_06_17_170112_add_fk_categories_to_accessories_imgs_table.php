<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFkCategoriesToAccessoriesImgsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accessories_imgs', function (Blueprint $table) {
          $table ->unsignedInteger('category');
          $table -> foreign('category')->references('id')->on('accessories_categories');
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
          
        });
    }
}
