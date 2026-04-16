<?php

namespace App\Http\Controllers\Api;

use App\Models\Place;
use Illuminate\Database\Eloquent\Model;

class PlaceController extends BaseApiCrudController
{
    protected function modelClass(): string
    {
        return Place::class;
    }

    protected function rules(?Model $model = null): array
    {
        $placeId = $model?->getKey();

        return [
            'city_id' => ['required', 'exists:cities,id'],
            'name' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'string', 'max:180', 'unique:places,slug,'.($placeId ?? 'NULL').',id'],
            'category' => ['required', 'string', 'max:80'],
            'description' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'address' => ['nullable', 'string', 'max:255'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'entry_price_min' => ['nullable', 'numeric'],
            'entry_price_max' => ['nullable', 'numeric'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    protected function relations(): array
    {
        return ['city.country'];
    }

    protected function filterable(): array
    {
        return ['city_id', 'is_published', 'category'];
    }

    protected function searchable(): array
    {
        return ['name', 'category', 'description'];
    }
}
