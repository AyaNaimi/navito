<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TouristProfile extends Model
{
    protected $fillable = [
        'user_id',
        'nationality',
        'passport_country',
        'phone',
        'current_latitude',
        'current_longitude',
        'detected_country_id',
        'detected_city_id',
    ];

    protected $casts = [
        'current_latitude' => 'float',
        'current_longitude' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
