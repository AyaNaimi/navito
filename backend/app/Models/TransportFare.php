<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportFare extends Model
{
    protected $fillable = ['city_id', 'transport_type', 'label', 'price_min', 'price_max', 'notes'];

    protected $casts = [
        'price_min' => 'float',
        'price_max' => 'float',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
