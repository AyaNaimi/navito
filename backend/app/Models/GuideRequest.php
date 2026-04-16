<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuideRequest extends Model
{
    protected $fillable = ['tourist_id', 'guide_id', 'city_id', 'travel_date', 'notes', 'status'];

    protected $casts = [
        'travel_date' => 'date',
    ];

    public function tourist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tourist_id');
    }

    public function guide(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guide_id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
