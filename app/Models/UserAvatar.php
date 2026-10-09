<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAvatar extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'skin_id',
        'hair_id',
        'shirt_id',
        'pants_id',
        'shoes_id',
        'hat_id',
        'accessory_id',
        'aura_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skin()
    {
        return $this->belongsTo(ShopItem::class, 'skin_id');
    }

    public function hair()
    {
        return $this->belongsTo(ShopItem::class, 'hair_id');
    }

    public function shirt()
    {
        return $this->belongsTo(ShopItem::class, 'shirt_id');
    }

    public function pants()
    {
        return $this->belongsTo(ShopItem::class, 'pants_id');
    }

    public function shoes()
    {
        return $this->belongsTo(ShopItem::class, 'shoes_id');
    }

    public function hat()
    {
        return $this->belongsTo(ShopItem::class, 'hat_id');
    }

    public function accessory()
    {
        return $this->belongsTo(ShopItem::class, 'accessory_id');
    }

    public function aura()
    {
        return $this->belongsTo(ShopItem::class, 'aura_id');
    }
}