<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shop_item_id',
        'equipped',
    ];

    protected $casts = [
        'equipped' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shopItem()
    {
        return $this->belongsTo(ShopItem::class);
    }

    public function items()
{
    return $this->belongsToMany(
        ShopItem::class,
        'user_items'
    )->withPivot('equipped')
     ->withTimestamps();
}
}
