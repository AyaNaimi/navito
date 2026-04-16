<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Restaurant extends Model
{
    protected $fillable = [
        'city_id', 'name', 'slug', 'cuisine', 'average_price', 'rating', 'is_halal',
        'latitude', 'longitude', 'address', 'opening_hours', 'phone', 'is_published',
    ];

    protected $casts = [
        'average_price' => 'float',
        'rating' => 'float',
        'is_halal' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'is_published' => 'boolean',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
