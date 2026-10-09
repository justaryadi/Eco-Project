<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_avatars', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('skin_id')->nullable()->constrained('shop_items')->nullOnDelete();
            $table->foreignId('hair_id')->nullable()->constrained('shop_items')->nullOnDelete();
            $table->foreignId('shirt_id')->nullable()->constrained('shop_items')->nullOnDelete();
            $table->foreignId('pants_id')->nullable()->constrained('shop_items')->nullOnDelete();
            $table->foreignId('shoes_id')->nullable()->constrained('shop_items')->nullOnDelete();
            $table->foreignId('hat_id')->nullable()->constrained('shop_items')->nullOnDelete();
            $table->foreignId('accessory_id')->nullable()->constrained('shop_items')->nullOnDelete();
            $table->foreignId('aura_id')->nullable()->constrained('shop_items')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_avatars');
    }
};