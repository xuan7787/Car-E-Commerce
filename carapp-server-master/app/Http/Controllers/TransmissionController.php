<?php

namespace App\Http\Controllers;

use App\Transmission;
use Illuminate\Http\Request;

class TransmissionController extends Controller
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

    public function allTransmissions()
    {
        $transmissions = Transmission::get();

        return response()->json([
            'transmissions' => $transmissions
        ]);
    }
}
