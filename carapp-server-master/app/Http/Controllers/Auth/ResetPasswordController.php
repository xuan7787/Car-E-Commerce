<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\User;
use Illuminate\Support\Facades\Hash;


class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
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

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'api_token' => ['required'],
            'password' => ['required'],
            'newPassword' => ['required', 'string', 'min:6', 'confirmed']
        ]);
    }

    public function reset(Request $request)
    {
        $this->validate($request, $this->validationErrorMessages());

        return $this->resetPassword($request);
    }

    protected function resetPassword(Request $request)
    {
        $user = Auth::guard('api')->user();
        if($user->checkPwd($request['password']))
        {
            $reset = User::where('api_token', $request['api_token'])
                ->update(['password'=>Hash::make($request['newPassword'])]);

            return response()->json([
                'state' => "You have successfully reset your password."
            ]);
        }


    }
}
