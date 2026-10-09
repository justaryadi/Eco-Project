<?php

namespace App\Http\Controllers;

use App\Models\ShopItem;
use App\Models\UserItem;
use App\Models\UserAvatar;
use Illuminate\Http\Request;

class AvatarController extends Controller
{
    // GET inventory
    public function inventory(Request $request)
    {
        $items = UserItem::with('shopItem')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($items);
    }

    // GET avatar yang sedang dipakai
    public function show(Request $request)
    {
        $avatar = UserAvatar::with([
            'skin',
            'hair',
            'shirt',
            'pants',
            'shoes',
            'hat',
            'accessory',
            'aura',
        ])->where('user_id', $request->user()->id)->first();

        return response()->json($avatar);
    }

    // POST equip item
    public function equip(Request $request, $id)
    {
        $user = $request->user();

        // Cari item yang dimiliki user
        $userItem = UserItem::with('shopItem')
            ->where('user_id', $user->id)
            ->where('shop_item_id', $id)
            ->first();

        if (!$userItem) {
            return response()->json([
                'message' => 'Item belum dimiliki.'
            ], 400);
        }

        $item = $userItem->shopItem;

        // Cari / buat avatar user
        $avatar = UserAvatar::firstOrCreate([
            'user_id' => $user->id,
        ]);

        // Tentukan slot berdasarkan category
        $slot = match (strtolower($item->category)) {
            'skin' => 'skin_id',
            'hair' => 'hair_id',
            'shirt' => 'shirt_id',
            'pants' => 'pants_id',
            'shoes' => 'shoes_id',
            'hat' => 'hat_id',
            'accessory' => 'accessory_id',
            'aura' => 'aura_id',
            default => null,
        };

        if (!$slot) {
            return response()->json([
                'message' => 'Category item tidak valid.'
            ], 400);
        }

        // Lepaskan item sebelumnya di slot yang sama
        UserItem::where('user_id', $user->id)
            ->whereHas('shopItem', function ($query) use ($item) {
                $query->where('category', $item->category);
            })
            ->update([
                'equipped' => false
            ]);

        // Equip item baru
        $userItem->update([
            'equipped' => true
        ]);

        $avatar->$slot = $item->id;
        $avatar->save();

        return response()->json([
            'message' => $item->name . ' berhasil dipakai.',
            'avatar' => $avatar->load([
                'skin',
                'hair',
                'shirt',
                'pants',
                'shoes',
                'hat',
                'accessory',
                'aura',
            ]),
        ]);
    }

    // POST unequip item
    public function unequip(Request $request, $id)
    {
        $user = $request->user();

        $userItem = UserItem::with('shopItem')
            ->where('user_id', $user->id)
            ->where('shop_item_id', $id)
            ->first();

        if (!$userItem) {
            return response()->json([
                'message' => 'Item tidak ditemukan di inventory.'
            ], 404);
        }

        $item = $userItem->shopItem;

        $userItem->update([
            'equipped' => false
        ]);

        $avatar = UserAvatar::where('user_id', $user->id)->first();

        if ($avatar) {
            $slot = match (strtolower($item->category)) {
                'skin' => 'skin_id',
                'hair' => 'hair_id',
                'shirt' => 'shirt_id',
                'pants' => 'pants_id',
                'shoes' => 'shoes_id',
                'hat' => 'hat_id',
                'accessory' => 'accessory_id',
                'aura' => 'aura_id',
                default => null,
            };

            if ($slot && $avatar->$slot == $item->id) {
                $avatar->$slot = null;
                $avatar->save();
            }
        }

        return response()->json([
            'message' => $item->name . ' dilepas.'
        ]);
    }
}