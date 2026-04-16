<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Place extends Model
{
    protected $fillable = [
        'city_id', 'name', 'slug', 'category', 'description', 'latitude', 'longitude',
        'address', 'opening_hours', 'entry_price_min', 'entry_price_max', 'rating', 'is_published',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'entry_price_min' => 'float',
        'entry_price_max' => 'float',
        'rating' => 'float',
        'is_published' => 'boolean',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
