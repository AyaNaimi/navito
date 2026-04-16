<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    protected $fillable = ['city_id', 'name', 'slug', 'description', 'duration_label', 'price_min', 'price_max', 'rating', 'is_published'];

    protected $casts = [
        'price_min' => 'float',
        'price_max' => 'float',
        'rating' => 'float',
        'is_published' => 'boolean',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
