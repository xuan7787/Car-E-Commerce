<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testsRegistersSuccessfully()
    {
       $payload = [
           'username' => 'John',
           'email' => 'john@toptal.com',
           'password' => 'toptal123',
           'password_confirmation' => 'toptal123',
           'first-name' => 'John',
           'last-name' => 'yun',
           'profile-img' => "qwqeqsaceonasg",
       ];

       $this->json('POST', '/api/register', $payload)
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
        $found = User::where('email','john@toptal.com')->get();
        $this->assertEquals(count($found),1);
    }



//    public function testsRequiresPasswordEmailAndName()
//    {
//        $this->json('POST', '/api/register')
//            ->assertStatus(422)
//            ->assertJson([
//                'username' => ['The username field is required.'],
//                'email' => ['The email field is required.'],
//                'password' => ['The password field is required.'],
//                'first-name' => ['The first-name field is required.'],
//                'last-name' => ['The last-namefield is required.'],
//                'profile-img' => ['The profile-img is required.'],
//            ]);
//    }
//
//    public function testsRequirePasswordConfirmation()
//    {
//        $payload = [
//            'username' => 'John',
//            'email' => 'john@toptal.com',
//            'password' => 'toptal123',
//            'first-name' => 'John',
//            'last-name' => 'yun',
//        ];
//
//        $this->json('POST', '/api/register', $payload)
//            ->assertStatus(422)
//            ->assertJson([
//                'password' => ['The password confirmation does not match.'],
//            ]);
//    }
}
