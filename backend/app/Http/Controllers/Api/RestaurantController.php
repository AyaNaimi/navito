<?php

namespace App\Http\Controllers\Api;

use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Model;

class RestaurantController extends BaseApiCrudController
{
    protected function modelClass(): string
    {
        return Restaurant::class;
    }

    protected function rules(?Model $model = null): array
    {
        $restaurantId = $model?->getKey();

        return [
            'city_id' => ['required', 'exists:cities,id'],
            'name' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'string', 'max:180', 'unique:restaurants,slug,'.($restaurantId ?? 'NULL').',id'],
            'cuisine' => ['nullable', 'string', 'max:120'],
            'average_price' => ['nullable', 'numeric'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'is_halal' => ['sometimes', 'boolean'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'address' => ['nullable', 'string', 'max:255'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    protected function relations(): array
    {
        return ['city.country'];
    }

    protected function filterable(): array
    {
        return ['city_id', 'is_published', 'is_halal'];
    }

    protected function searchable(): array
    {
        return ['name', 'cuisine', 'address'];
    }
}
