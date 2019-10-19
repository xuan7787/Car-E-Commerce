<?php

namespace App\Http\Controllers;

use App\CarListing;
use App\User;
use App\postImg;
use App\accessoriesImg;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class CarListingController extends Controller
{
    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric'],
            'registration_date' => ['required', 'date'],
            'mileage' => ['required', 'numeric'],
            'seats' =>  ['required', 'integer', 'max:128','min:1'],
            'doors' =>  ['required', 'integer', 'max:128','min:1'],
            'description' => ['required', 'string'],
            'owners' =>['required', 'integer', 'max:128','min:1'],
            'manufactured' => ['required', 'date'],
            'omv' => ['required', 'numeric'],
            'arf' => ['required', 'numeric'],
            'deregistration_val' => ['required', 'numeric'],
            'bhp' => ['required', 'numeric'],
            'engine_capacity' => ['required', 'numeric'],
            'road_tax' => ['required', 'numeric'],
        ]);
    }

    protected function create(array $data)
    {
        $getId = User::select('id')
            ->where('api_token', $data['api_token'])
            ->get();

        return CarListing::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'registration_date' => $data['registration_date'],
            'mileage' => $data['mileage'],
            'seats' => $data['seats'],
            'doors' => $data['doors'],
            'description' => $data['description'],
            'owners' => $data['owners'],
            'manufactured' => $data['manufactured'],
            'omv' => $data['omv'],
            'arf' => $data['arf'],
            'deregistration_val' => $data['deregistration_val'],
            'bhp' => $data['bhp'],
            'engine_capacity' => $data['engine_capacity'],
            'road_tax' => $data['road_tax'],
            'post_by' => $getId[0]['id'],
            'type' => $data['type'],
            'make' => $data['make'],
            'transmission' => $data['transmission'],
            'plate_number' => $data['plate_number'],
            'coe' => $data['coe'],
            'coe_expiry_date' => $data['coe_expiry_date'],
            'fuel' => $data['fuel'],
            'sold_by' => $data['sold_by'],
            'mobile_number' =>$data['mobile_number'],
            'email' => $data['email']
        ]);
    }

    public function postCar(Request $request)
    {
//        $this->validator($request->all())->validate();

        $carPost = $this->create($request->all());

        return $this->carPosted($request, $carPost);
    }

    protected function carPosted(Request $request, $carPost)
    {
        if ($request->hasFile('postImg')) {
            $carPost->uploadPostImg($request);
        }

        if ($request->hasFile('accessoriesImg')) {
            $carPost->uploadAccessoryImg($request);
        }

        return response()->json([
            'state'=>"The car was posted."
        ]);
    }

    public function getCarPost()
    {
        $getCarPost = CarListing::select('id', 'name', 'price', 'registration_date', 'mileage', 'owners', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        $getPostImg = $this->getCarPostImg();

        return response()->json([
            'posts' => $getCarPost,
            'images' => $getPostImg
        ]);
    }

    public function getUserCarPost(Request $request)
    {
        if ($request->api_token) {
            $getId = User::where('api_token', $request['api_token'])->get();
        } elseif ($request->username) {
            $getId = User::where('username', $request->username)->get();
        }

        $getUserCarPost = CarListing::select('id', 'name', 'price', 'registration_date', 'mileage', 'owners', 'updated_at')
            ->where('post_by', $getId[0]['id'])
            ->orderBy('updated_at', 'desc')
            ->get();

        $userCarPostImgs = array();

        for ($i = 0; $i < count($getUserCarPost); $i++) {
            $postId = $getUserCarPost[$i]['id'];
            array_push($userCarPostImgs, $this->getUserCarPostImg($postId));
        }

        return response()->json([
            'posts' => $getUserCarPost,
            'images' => $userCarPostImgs,
        ]);
    }

    public function getSpecificCarPost(Request $request)
    {
        $getACarPost = CarListing::where('id', $request->id)->get();
        $getUserInfo = User::select('username')->where('id', $getACarPost[0]['post_by'])->get();
        // $getUserInfo = User::select('username','email','mobile-number')->where('id', $getACarPost[0]['post_by'])->get();
        $getACarPost[0]['post_by'] = $getUserInfo[0]['username'];
        $postImg = $this->getAllPostImg($request);
        $accessoriesImg = $this->getAllAccessoriesImg($request);

        $marketComparsion = $this->getMarketComparison($getACarPost);

        return response()->json([
            'post' => $getACarPost,
            'post-img' => $postImg,
            'accessories-img' => $accessoriesImg,
            'market_comparison' => $marketComparsion
            // 'contact' => $getUserInfo,
        ]);
    }


    protected function getMarketComparison($car)
    {
        $marketComparison = CarListing::select('price','updated_at')
        ->where('type', $car[0]['type'])
        ->where('make', $car[0]['make'])
        ->orderBy('updated_at', 'desc')
        ->get();
        
        return $marketComparison;
    }

    public function updateCarPost(Request $request)
    {
        $getId = User::where('api_token', $request['api_token'])->get();
        if ($getId->count() == 0) {
            return response()->json([
                'state' => "Permission denied."
            ]);
        } else {
            $userId = $getId[0]['id'];
        }

        $updateCarPost = CarListing::where('id', $request->id)
            ->where('post_by', $userId)
            ->update([
                'name' => $request['name'],
                'price' => $request['price'],
                'registration_date' => $request['registration_date'],
                'mileage' => $request['mileage'],
                'seats' => $request['seats'],
                'doors' => $request['doors'],
                'description' => $request['description'],
                'owners' => $request['owners'],
                'manufactured' => $request['manufactured'],
                'omv' => $request['omv'],
                'arf' => $request['arf'],
                'deregistration_val' => $request['deregistration_val'],
                'bhp' => $request['bhp'],
                'engine_capacity' => $request['engine_capacity'],
                'road_tax' => $request['road_tax'],
                'type' => $request['type'],
                'make' => $request['make'],
                'transmission' => $request['transmission'],
                'plate_number' => $data['plate_number'],
                'coe' => $data['coe'],
                'coe_expiry_date' => $data['coe_expiry_date'],
                'fuel' => $data['fuel'],
                'sold_by' => $data['sold_by'],
                'mobile_number' => $data['mobile_number'],
                'email' => $data['email']
                ]);
        return response()->json([
            'state' => "Post is updated."
        ]);
    }

    public function deleteCarPost(Request $request)
    {
        $getId = User::where('api_token', $request['api_token'])->get();
        if ($getId->count() == 0) {
            return response()->json([
                'state' => "Permission denied."
            ]);
        } else {
            $userId = $getId[0]['id'];
        }

        $post = CarListing::where('id', $request->id)->get();
        $ownerId =$post[0]['id'];


        if ($userId = $ownerId) {
            $deleteCarPost = CarListing::where('id', $request->id)
                ->where('post_by', $userId)
                ->delete();
            return response()->json([
                'state' => "Post is deleted."
            ]);
        } else {
            return response()->json([
                'state' => "Permission denied."
            ]);
        }
    }

    protected function getCarPostImg()
    {
        $postImg = postImg::select('post_id', "file_name")
        ->where('img_sequence', 1)
        ->get();
        return $postImg;
    }

    protected function getUserCarPostImg($request)
    {
        $postImg = postImg::select('post_id', "file_name")
           ->where('post_id', $request)
           ->where('img_sequence', 1)
           ->first();
        return $postImg;
    }

    protected function getAllPostImg($request)
    {
        $postImg = postImg::select("file_name", 'img_sequence')
            ->where('post_id', $request->id)
            ->get();
        return $postImg;
    }

    protected function getAllAccessoriesImg($request)
    {
        $accessoriesImg = accessoriesImg::select("file_name", 'img_sequence', 'description', 'category')
            ->where('post_id', $request->id)
            ->get();
        return $accessoriesImg;
    }
}
