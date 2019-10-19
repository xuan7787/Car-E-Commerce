<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Crypt;

class ShowUserInfoController extends Controller
{
    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    public function userInfo(Request $request)
    {
      if($request->username)
      {
        $userInfo = User::select('username','first-name','last-name','profile-img','mobile_number', 'email')
        ->where('username',$request['username'])
        ->get();

        return response()->json([
            'user' => $userInfo
        ]);
      }
      else if($request->api_token)
      {
        $userInfo = User::select('username','first-name','last-name','profile-img','mobile_number', 'email')
        ->where('api_token',$request['api_token'])
        ->get();

        return response()->json([
            'user' => $userInfo
        ]);
      }
    }

    public function userInfoA(Request $request)
    {
        $userInfo = User::where('email',$request['email'])->get();
        return response()->json([
            'user' => $userInfo
        ]);
    }
}
