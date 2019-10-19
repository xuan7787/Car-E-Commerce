<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LoginTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testsLoginSuccessfully()
    {
        $payload = [
            'email' => 'john@toptal.com',
            'password' => 'toptal123',
        ];

        $this->json('POST', '/api/login', $payload)
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'username',
                    'email',
                    'created_at',
                    'updated_at',
                    'first-name',
                    'last-name',
                    'profile-img',
                ],
            ]);;

        //Find and get the user, this will return a laravel collocation.
//        $found = User::where('email','john@toptal.com')->get();
//        $this->assertEquals(count($found),1);
    }

//    public function testRequiresEmailAndLogin()
//    {
//        $this->json('POST', '/api/login')
//            ->assertStatus(422)
//            ->assertJson([
//                'email' => ['The email field is required.'],
//                'password' => ['The password field is required.'],
//            ]);
//    }

}
