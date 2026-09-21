<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quests', function (Blueprint $table) {
            $table->renameColumn('users_id', 'user_id');
        });
    }

    public function down(): void
    {
        Schema::table('quests', function (Blueprint $table) {
            $table->renameColumn('user_id', 'users_id');
        });
    }
};