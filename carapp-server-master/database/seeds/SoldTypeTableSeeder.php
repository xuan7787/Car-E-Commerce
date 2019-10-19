<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use App\sold_type;

class SoldTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $json = File::get("database/data/solde-type.json");
      $data = json_decode($json);
      foreach ($data as $obj)
      {
        sold_type::create(array(
          'name' => $obj->name,
          'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
          'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
          'slug' => Str::slug($obj->name)
        ));
      }
    }
}
