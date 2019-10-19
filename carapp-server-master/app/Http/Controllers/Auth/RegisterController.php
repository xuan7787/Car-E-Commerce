<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Auth\Events\Registered;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

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

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'username' => ['required', 'string', 'max:255'],
            'email' => ['string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'first-name' => ['required', 'string', 'max:255'],
            'last-name' => ['required', 'string', 'max:255'],
            'mobile_number' => ['string', 'max:12'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function createEmail(array $data)
    {
        return User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'first-name' => $data['first-name'],
            'last-name' => $data['last-name']
        ]);
    }

    protected function createMobileNum(array $data)
    {
        return User::create([
            'username' => $data['username'],
            'password' => Hash::make($data['password']),
            'first-name' => $data['first-name'],
            'last-name' => $data['last-name'],
            'mobile_number' => $data['mobile_number']
        ]);
    }

    public function registerEmail(Request $request)
    {
        if($request->hasFile('postImg'))
        {
            $request['profile-img'] = $this->uploadProfile($request);
        }

        event(new Registered($user = $this->createEmail($request->all())));

      return $this->registered();
    }

    public function registerMobileNum(Request $request)
    {
        if($request->hasFile('postImg'))
        {
            $request['profile-img'] = $this->uploadProfile($request);
        }

        event(new Registered($user = $this->createMobileNum($request->all())));

      return $this->registered();
    }

    public function checkEmail(Request $request)
    {
        $check = User::where('email', $request->email)->get();

        if($check == '[]')
        {
            return 1;
        }

        else
        {
            return 0;
        }
    }

    public function uploadProfile(Request $request)
    {
        $allowFileExtension = ['jpg', 'png', 'jpeg'];
        $files = $request->file('profile-img');

        foreach ($files as $index => $file)
        {
            $filename = str_random(6) . '-' . time();
            $extension = $file->getClientOriginalExtension();
            $check = in_array($extension, $allowFileExtension);
            if ($check) {
                $file->move(public_path('profile-img'), $filename);
                return $filename;
            }

            else {
                echo "Fail to upload";
            }
        }
    }

    protected function registered()
    {
        return response()->json([
            "state"=>"Registration Successful"
        ]);
    }
}
