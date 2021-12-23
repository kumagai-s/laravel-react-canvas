<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::post('/draw', function (Request $request) {
    broadcast(new \App\Events\PublicEvent($request->input('data')))->toOthers();
});

Route::post('/upload', function (Request $request) {
    $filename = time() . '.png';
    $request->file('file')->storeAs('/public/uploads', $filename);
    broadcast(new \App\Events\ImageUploadedEvent($filename));
});

Route::post('/undo', function (Request $request) {
    broadcast(new \App\Events\UndoEvent($request->input('data')))->toOthers();
});

Route::post('/redo', function (Request $request) {
    broadcast(new \App\Events\RedoEvent($request->input('data')))->toOthers();
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
