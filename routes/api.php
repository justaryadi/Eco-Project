<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuestController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\AvatarController;

// =========================
// USER
// =========================

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Login
Route::post('/login', [UserController::class, 'login']);


// =========================
// QUEST
// =========================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/quests', [QuestController::class, 'index']);
    Route::post('/quests', [QuestController::class, 'store']);
    Route::put('/quests/{id}', [QuestController::class, 'update']);
    Route::delete('/quests/{id}', [QuestController::class, 'destroy']);
    Route::get('/shop', [ShopController::class, 'index']);
    Route::post('/shop/{id}/buy', [ShopController::class, 'buy']);
    Route::get('/inventory', [ShopController::class, 'inventory']);
    Route::get('/avatar', [AvatarController::class, 'show']);
    Route::get('/avatar/inventory', [AvatarController::class, 'inventory']);
    Route::post('/avatar/{id}/equip', [AvatarController::class, 'equip']);
    Route::post('/avatar/{id}/unequip', [AvatarController::class, 'unequip']);

});