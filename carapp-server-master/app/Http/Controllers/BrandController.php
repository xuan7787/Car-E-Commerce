<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Brand;

class BrandController extends Controller
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

    //API: get all brands
    public function allBrands()
    {
        $brands = Brand::select('id', 'slug')->get();
        return response()->json([
            'brands' => $brands
        ]);
    }

    //API: get a specific brand info
    public function getBrand(Request $request)
    {
        $getBrand =  Brand::where('id', $request->id)->get();
        return response()->json([
             'brand' => $getBrand
         ]);
    }

    //API: add a new brand into table
    public function addBrand(Request $request)
    {
        $newBrand =  Brand::create(['name' => $request['name']]);
        return response()->json([
            'state' => 'New brand is added.'
        ]);
    }

    //API: update a selected brand
    public function updateBrand(Request $request)
    {
        $updateBrand =  Brand::where('id', $request->id)
            ->update(['name' => $request['name']]);
        return response()->json([
            'state' => 'Brand is updated.'
        ]);
    }

    //API: delete a specific brand from table
    public function deleteBrand(Request $request)
    {
        $deleteBrand =  Brand::where('id', $request['id'])->delete();
        return response()->json([
            'state' => 'Brand is deleted.'
        ]);
    }
}
