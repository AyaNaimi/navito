<?php

namespace App\Http\Controllers\Api;

use App\Models\TransportFare;
use Illuminate\Database\Eloquent\Model;

class TransportFareController extends BaseApiCrudController
{
    protected function modelClass(): string
    {
        return TransportFare::class;
    }

    protected function rules(?Model $model = null): array
    {
        return [
            'city_id' => ['required', 'exists:cities,id'],
            'transport_type' => ['required', 'string', 'max:80'],
            'label' => ['required', 'string', 'max:160'],
            'price_min' => ['nullable', 'numeric'],
            'price_max' => ['nullable', 'numeric'],
            'notes' => ['nullable', 'string'],
        ];
    }

    protected function relations(): array
    {
        return ['city.country'];
    }

    protected function filterable(): array
    {
        return ['city_id', 'transport_type'];
    }

    protected function searchable(): array
    {
        return ['label', 'notes'];
    }
}
