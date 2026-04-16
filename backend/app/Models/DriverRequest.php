<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DriverRequest extends Model
{
    protected $fillable = [
        'tourist_id',
        'driver_id',
        'city_id',
        'pickup_location',
        'destination',
        'travel_date',
        'notes',
        'status',
    ];

    protected $casts = [
        'travel_date' => 'date',
    ];

    public function tourist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tourist_id');
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
