<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);
        $this->call(TransmissionTableSeeder::class);
        $this->call(TypeTableSeeder::class);
        $this->call(BrandTableSeeder::class);
        $this->call(FuelsTableSeeder::class);
        $this->call(AccessoryCategoryTableSeeder::class);
        $this->call(SoldTypeTableSeeder::class);
    }
}
