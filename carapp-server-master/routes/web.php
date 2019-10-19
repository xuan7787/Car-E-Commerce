<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/user', 'HomeController@userPage')->name('user');
Route::get('/car-post', 'HomeController@carPostPage')->name('carpost');
Route::get('/brand', 'HomeController@brandPage')->name('brand');

Route::Post('/loginA', 'Auth\LoginController@loginA')->name('adminLogin');
Route::Post('/logout', 'Auth\LoginController@logout')->name('adminLogout');
Route::get('/home', 'HomeController@index')->name('home');
Route::Post('/logout', 'Auth\LoginController@logout')->name('logout');


Route::get('/redirect', 'SocialAuthMyInfoController@redirect');
Route::get('/callback', 'SocialAuthMyInfoController@callback');
