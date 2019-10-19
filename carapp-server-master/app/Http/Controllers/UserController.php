<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  public function index(Request $request)
  {
     return $users = User::all();
  }

  public function updateUserInfoA(Request $request)
  {
      $updateUser = User::where('email', $request->email)
          ->update([
              'username' => $request['username'],
              'email' => $request['email'],
              'password' => Hash::make($request['password']),
              'first-name' => $request['first-name'],
              'last-name' => $request['last-name'],
              'profile-img' => $request['profile-img'],
          ]);

      return response()->json([
          'state' => "User Info is updated."
      ]);
  }

    public function deleteUserA(Request $request)
    {

        $updateUser = User::where('email', $request->email)->delete();

        return response()->json([
            'state' => "User is deleted."
        ]);
    }
}
