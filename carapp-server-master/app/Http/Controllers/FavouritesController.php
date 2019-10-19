<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\favoriteLists;
use App\User;
use App\CarListing;
use App\postImg;

class FavouritesController extends Controller
{
    /**
     * Where to redirect users after login.
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
        $this->middleware('guest')->except('logout');
    }

    public function favouriteList(Request $request)
    {
        $getId = User::where('api_token', $request['api_token'])->get();
        $userId = $getId[0]['id'];

        $favouriteList = favoriteLists::select('id',"post_id")
          ->where('user_id', $userId)
          ->get();

        $favouritePostDetails = array();
        $favouritePostImgs = array();

        for ($i = 0; $i < count($favouriteList); $i++)
        {
          $favouritePostDetail = CarListing::select('id','name','price','registration_date','mileage','owners','updated_at')
            ->where('id', $favouriteList[$i]['post_id'])
            ->first();

          $favouritePostImg = postImg::select('post_id', "file_name")
            ->where('img_sequence', 1)
            ->where('post_id', $favouriteList[$i]['post_id'])
            ->first();
          array_push($favouritePostDetails, $favouritePostDetail);
          array_push($favouritePostImgs, $favouritePostImg);
        }

        return response()->json([
            'list' => $favouriteList,
            'posts' => $favouritePostDetails,
            'images' =>   $favouritePostImgs
        ]);
    }

    public function addFavourite(Request $request)
    {
        $getId = User::where('api_token', $request['api_token'])->get();

        if($checkE = favoriteLists::where('user_id', $getId[0]['id'])
        ->where('post_id',$request['post_id'])
        ->exists())
        {
          return response()->json([
              'state' => 'Post already in the favourite list.'
          ]);
        }
        else {
          favoriteLists::create([
              'user_id' => $getId[0]['id'],
              'post_id' => $request['post_id'],
          ]);

          return response()->json([
              'state' => 'Successfully added to favourite list.'
          ]);
        }
    }

    public function deleteFavourite(Request $request)
    {
        $getId = User::where('api_token', $request['api_token'])->get();

        favoriteLists::where('user_id', $getId[0]['id'])
            ->where('post_id', $request['post_id'])
            ->delete();

        return response()->json([
            'state' => 'Successfully removed from favourite list.'
        ]);
    }
}
