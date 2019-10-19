<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransmissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('transmissions')->insert([
            'name' => 'Automatic',
        ]);

        DB::table('transmissions')->insert([
            'name' => 'Manual',
        ]);
    }
}
