<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CommunityEvent extends Model
{
    protected $fillable = [
        'organizer_id', 'city_id', 'title', 'description', 'meetup_point', 'starts_at',
        'ends_at', 'min_participants', 'max_participants', 'level', 'status',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'community_event_participants')
            ->withPivot('joined_at');
    }
}
