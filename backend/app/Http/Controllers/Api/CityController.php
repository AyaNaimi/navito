<?php

namespace App\Http\Controllers\Api;

use App\Models\City;
use Illuminate\Database\Eloquent\Model;

class CityController extends BaseApiCrudController
{
    protected function modelClass(): string
    {
        return City::class;
    }

    protected function rules(?Model $model = null): array
    {
        $cityId = $model?->getKey();

        return [
            'country_id' => ['required', 'exists:countries,id'],
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:140', 'unique:cities,slug,'.($cityId ?? 'NULL').',id'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'is_supported' => ['sometimes', 'boolean'],
        ];
    }

    protected function relations(): array
    {
        return ['country'];
    }

    protected function filterable(): array
    {
        return ['country_id', 'is_supported'];
    }

    protected function searchable(): array
    {
        return ['name', 'slug'];
    }
}
