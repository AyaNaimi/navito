<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScamReport extends Model
{
    protected $fillable = ['city_id', 'title', 'category', 'description', 'prevention_tips', 'severity'];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
