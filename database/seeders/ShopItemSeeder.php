<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShopItemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('shop_items')->insert([
            [
                'name' => 'Default Hair',
                'category' => 'Hair',
                'rarity' => 'Common',
                'price' => 0,
                'asset' => 'hair-default',
                'description' => 'Rambut default untuk avatar.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Forest Hair',
                'category' => 'Hair',
                'rarity' => 'Uncommon',
                'price' => 80,
                'asset' => 'hair-forest',
                'description' => 'Rambut dengan gaya bertema alam.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Eco Hoodie',
                'category' => 'Shirt',
                'rarity' => 'Rare',
                'price' => 150,
                'asset' => 'shirt-eco-hoodie',
                'description' => 'Hoodie bertema lingkungan.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Explorer Pants',
                'category' => 'Pants',
                'rarity' => 'Uncommon',
                'price' => 120,
                'asset' => 'pants-explorer',
                'description' => 'Celana untuk eco explorer.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Eco Sneakers',
                'category' => 'Shoes',
                'rarity' => 'Rare',
                'price' => 180,
                'asset' => 'shoes-eco',
                'description' => 'Sneakers khusus eco hero.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Leaf Crown',
                'category' => 'Hat',
                'rarity' => 'Epic',
                'price' => 350,
                'asset' => 'hat-leaf-crown',
                'description' => 'Mahkota daun untuk eco hero.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Eco Backpack',
                'category' => 'Accessory',
                'rarity' => 'Epic',
                'price' => 400,
                'asset' => 'accessory-backpack',
                'description' => 'Tas untuk petualangan ramah lingkungan.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nature Aura',
                'category' => 'Aura',
                'rarity' => 'Legendary',
                'price' => 800,
                'asset' => 'aura-nature',
                'description' => 'Aura spesial untuk eco hero.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}