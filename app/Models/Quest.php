<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'priority',
        'due_date',
        'completed',
    ];
}