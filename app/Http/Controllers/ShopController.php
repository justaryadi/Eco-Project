<?php

namespace App\Http\Controllers;

use App\Models\ShopItem;
use App\Models\UserItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    // GET semua item shop
    public function index(Request $request)
    {
        $user = $request->user();

        $items = ShopItem::orderBy('price')->get();

        $ownedItems = UserItem::where('user_id', $user->id)
            ->pluck('shop_item_id')
            ->toArray();

        $items->transform(function ($item) use ($ownedItems) {
            $item->owned = in_array($item->id, $ownedItems);

            return $item;
        });

        return response()->json([
            'points' => $user->points,
            'level' => $user->level,
            'items' => $items,
        ]);
    }

    // POST beli item
    public function buy(Request $request, $id)
    {
        $user = $request->user();

        $item = ShopItem::findOrFail($id);

        // Cek apakah sudah punya
        $alreadyOwned = UserItem::where('user_id', $user->id)
            ->where('shop_item_id', $item->id)
            ->exists();

        if ($alreadyOwned) {
            return response()->json([
                'message' => 'Kamu sudah memiliki item ini.'
            ], 400);
        }

        // Cek points
        if ($user->points < $item->price) {
            return response()->json([
                'message' => 'Points kamu tidak cukup.'
            ], 400);
        }

        DB::transaction(function () use ($user, $item) {

            // Kurangi points
            $user->points -= $item->price;
            $user->save();

            // Masukkan item ke inventory
            UserItem::create([
                'user_id' => $user->id,
                'shop_item_id' => $item->id,
                'equipped' => false,
            ]);
        });

        return response()->json([
            'message' => 'Item berhasil dibeli!',
            'points' => $user->points,
            'item' => $item,
        ]);
    }

    // GET inventory user
    public function inventory(Request $request)
    {
        $items = UserItem::with('shopItem')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($items);
    }
}