<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

 Route::middleware('auth:api')->get('/user', function (Request $request) {
     return $request->user();
 });

//---User API---
//Get User List
Route::get('users', 'UserController@index');

//User Register
Route::post('register-email', 'Auth\RegisterController@registerEmail');

//User Register
Route::post('register-mobile', 'Auth\RegisterController@registerMobileNum');

//User Login
Route::post('login', 'Auth\LoginController@login');

//User Login
//Route::post('loginA', 'Auth\LoginController@loginA');

//User Log out
Route::post('logout', 'Auth\LoginController@logout');

//User reset Password
Route::post('resetPassword', 'Auth\ResetPasswordController@reset');

//User info
Route::get('user-info', 'ShowUserInfoController@userInfo');


//---Car Post API---
//Posting of car
Route::post('car-post', 'CarListingController@postCar');

//Update car post
Route::post('update-car-post', 'CarListingController@updateCarPost');

//Update car post
Route::post('delete-car-post', 'CarListingController@deleteCarPost');

//Get all car post
Route::get('get-car-post', 'CarListingController@getCarPost');

//Get all car posted by User
Route::get('get-user-car-post', 'CarListingController@getUserCarPost');

//Get specific car post
Route::get('get-specific-car-post', 'CarListingController@getSpecificCarPost');

//Car List Filter
Route::post('car-filter', 'CarListFilterController@filter');

//Get all types
Route::get('types', 'TypeController@allTypes');

//Get all transmissions
Route::get('transmissions', 'TransmissionController@allTransmissions');


//---- Brand API ----
//Get all brands
Route::get('brands', 'BrandController@allBrands');

//Get a brand
Route::get('get-brand', 'BrandController@getBrand');

//Update brand
Route::post('update-brand', 'BrandController@updateBrand');

//Add new brand
Route::post('add-brand', 'BrandController@addBrand');

//Delete a brand
Route::get('delete-brand', 'BrandController@deleteBrand');




//---Favourite API---
//Get login user favourite list
Route::get('favourite-list', 'FavouritesController@favouriteList');

//Add post to favourite list
Route::post('add-favourite', 'FavouritesController@addFavourite');

//Remove post from favourite list
Route::post('remove-favourite', 'FavouritesController@deleteFavourite');


//---Filter API---
//Get filter preset
Route::get('get-filter', 'SaveFilterController@getFilter');

//Save filter preset
Route::post('save-filter', 'SaveFilterController@saveFilter');

//Remove saved filter preset
Route::post('delete-filter', 'SaveFilterController@deleteFavourite');

//Check whether email is available
Route::get('check-email', 'Auth\RegisterController@checkEmail');


//---Admin API---
//Get user info
Route::get('user-info-a', 'ShowUserInfoController@userInfoA');

//Update user info
Route::post('user-update-a', 'UserController@updateUserInfoA');

//Delete user
Route::get('user-delete-a', 'UserController@deleteUserA');
