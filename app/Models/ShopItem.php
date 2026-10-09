<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'rarity',
        'price',
        'asset',
        'description',
    ];

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'user_items'
        )->withPivot('equipped')
         ->withTimestamps();
    }
}