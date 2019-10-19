<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CarListing;

class CarListFilterController extends Controller
{
    /**
     * Where to redirect users after api call.
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

    //API: to filter the car postings
    public function filter(Request $request)
    {
        $query = CarListing::query();
        //Select the columns from the db.
        $query->select('id', 'name', 'price', 'registration_date', 'mileage', 'owners', 'updated_at');

        //If parameter 'seats' is in the post request
        if ($request->seats != null) {
            //add 'seats' condition to query
            $query->where('seats', '<=', $request->seats);
        }

        //If parameter 'doors' is in the post request
        if ($request->doors != null) {
            //add 'doors' condition to query
            $query->where('doors', '<=', $request->doors);
        }

        //If parameter 'types' is in the post request
        if ($request->types != null) {
            $types = str_replace('[', '', $request->types);
            $types = str_replace(']', '', $types);
            //add 'types' condition to query
            $query->whereIn('type', array($types));
        }

        //If parameter 'makes' is in the post request
        if ($request->makes != null) {
            $makes = str_replace('[', '', $request->makes);
            $makes = str_replace(']', '', $makes);
            //add 'makes' condition to query
            $query->whereIn('make', array($makes));
        }

        //If parameter 'transmission' is in the post request
        if ($request->transmission != null) {
            //add 'transmission' condition to query
            $query->whereIn('transmission', array($request->transmission));
        }

        //If parameter 'budget' is in the post request
        if ($request->budgetMin != null && $request->budgetMax != null) {
            //add 'budget' condition to query
            //Budget has maximum and minimum vaule
            $query->whereBetween('price', array(intval($request->budgetMin), intval($request->budgetMax)));
        }

        //If parameter 'sortBy' is in the post request
        if ($request->sortBy != null) {
            //add 'sortBy' condition to query
            switch ($request->sortBy) {
                case 'lowest_price':
                    $query->orderBy('price', 'asc');
                    break;
                case 'highest_price':
                    $query->orderBy('price', 'desc');
                    break;
                case 'lowest_depre':
                    $query->orderBy('deregistration_val', 'asc');
                    break;
                case 'highest_depre':
                    $query->orderBy('deregistration_val', 'desc');
                    break;
                case 'newly_listed':
                    $query->orderBy('updated_at', 'desc');
                    break;
                default:
                    $query->orderBy('updated_at', 'desc');

            }
        }

        $listFilter = $query->get();
        return $this->carListFilter($listFilter);

        //        $listFilter = CarListing::whereIn('type', array(1,2))
        //            ->whereIn('make',array(1,2))
        //            ->whereBetween('price', array(2, 1000000))
        //            ->orderBy('price','asc')
        //            ->get();
    }

    protected function carListFilter($listFilter)
    {
        //Make API return as json formate
        return response()->json([
            'data' => $listFilter
        ]);
    }
}
