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

Route::post('/rooms/create', [\App\Http\Controllers\API\RoomController::class, 'store']);

Route::post('/draw', [\App\Http\Controllers\API\WebSocketController::class, 'draw']);

Route::post('/upload', [\App\Http\Controllers\API\WebSocketController::class, 'upload']);



//Route::post('/undo', function (Request $request) {
//    broadcast(new \App\Events\UndoEvent($request->input('data')))->toOthers();
//});
//
//Route::post('/redo', function (Request $request) {
//    broadcast(new \App\Events\RedoEvent($request->input('data')))->toOthers();
//});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
