<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'username' => 'user',
            'email' => 'user@gmail.com',
            'password' => Hash::make('user'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'first-name' => 'User',
            'last-name' => 'User',
            'role' => 'user',
            'state' => 'active',
            'mobile_number' => '+65-12345678'
        ]);

        DB::table('users')->insert([
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'first-name' => 'Admin',
            'last-name' => 'Admin',
            'role' => 'admin',
            'mobile_number' => '+65-87654321'
        ]);


    }
}
