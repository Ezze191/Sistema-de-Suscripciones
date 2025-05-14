<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SuscriptionsController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/suscriptions', [SuscriptionsController::class, 'index']);

Route::post('/new', [SuscriptionsController::class, 'store']);

Route::get('/suscriptions/{id}', [SuscriptionsController::class, 'show']);

Route::delete('/delete/{id}', [SuscriptionsController::class, 'destroy']);

Route::put('/update/{id}', [SuscriptionsController::class, 'update']);
