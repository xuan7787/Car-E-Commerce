<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Filter;
use App\User;

class SaveFilterController extends Controller
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

    public function getFilter(Request $request)
    {
        $getId = User::where('api_token', $request['api_token'])->get();
        $userId = $getId[0]['id'];

        $filterPreset = Filter::where('user_id', $userId)->get();

        return response()->json([
            'filter' => $filterPreset
        ]);
    }

    public function saveFilter(Request $request)
    {
        $getId = User::where('api_token', $request['api_token'])->get();

        Filter::create([
            'name' => $request->name,
            'filterArr' => $request->filterArr,
            'user_id' => $getId[0]['id'],
        ]);

        return response()->json([
            'state' => 'Successfully saved filter preset.'
        ]);
    }

    public function deleteFilter(Request $request)
    {
        $getId = User::where('api_token', $request['api_token'])->get();

        Filter::where('user_id', $getId[0]['id'])
            ->where('id', $request['id'])
            ->where('name', $request->name)
            ->delete();

        return response()->json([
            'state' => 'Successfully deleted filter preset.'
        ]);
    }
}
