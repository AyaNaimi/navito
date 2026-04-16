<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'preferred_language',
        'last_country_id',
        'last_city_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')->withTimestamps();
    }

    public function touristProfile(): HasOne
    {
        return $this->hasOne(TouristProfile::class);
    }

    public function guideProfile(): HasOne
    {
        return $this->hasOne(GuideProfile::class);
    }

    public function driverProfile(): HasOne
    {
        return $this->hasOne(DriverProfile::class);
    }

    public function lastCountry(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'last_country_id');
    }

    public function lastCity(): BelongsTo
    {
        return $this->belongsTo(City::class, 'last_city_id');
    }

    public function guideRequestsAsTourist(): HasMany
    {
        return $this->hasMany(GuideRequest::class, 'tourist_id');
    }

    public function guideRequestsAsGuide(): HasMany
    {
        return $this->hasMany(GuideRequest::class, 'guide_id');
    }

    public function driverRequestsAsTourist(): HasMany
    {
        return $this->hasMany(DriverRequest::class, 'tourist_id');
    }

    public function driverRequestsAsDriver(): HasMany
    {
        return $this->hasMany(DriverRequest::class, 'driver_id');
    }

    public function organizedEvents(): HasMany
    {
        return $this->hasMany(CommunityEvent::class, 'organizer_id');
    }

    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user')->withTimestamps();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function hasRole(string $role): bool
    {
        return $this->roles->contains(fn (Role $userRole) => $userRole->name === $role);
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->roles->contains(fn (Role $userRole) => in_array($userRole->name, $roles, true));
    }

    public function primaryRole(): ?string
    {
        return $this->roles->first()?->name;
    }

    public function rolePayload(): array
    {
        return [
            'role' => $this->primaryRole(),
            'roles' => $this->roles->pluck('name')->values()->all(),
        ];
    }
}
