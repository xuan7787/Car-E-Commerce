<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password', 'first-name', 'last-name', 'profile-img','mobile_number'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function generateToken(){
        $this->api_token = str_random(60);
        $this->save();

        return $this->api_token;
    }

    public function checkPwd($pwd)
    {
        $hashedPassword = $this->password;

        if(Hash::check($pwd, $hashedPassword))
        {
            return true;
        }
        return false;
    }
}
