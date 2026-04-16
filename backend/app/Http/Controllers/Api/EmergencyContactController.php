<?php

namespace App\Http\Controllers\Api;

use App\Models\EmergencyContact;
use Illuminate\Database\Eloquent\Model;

class EmergencyContactController extends BaseApiCrudController
{
    protected function modelClass(): string
    {
        return EmergencyContact::class;
    }

    protected function rules(?Model $model = null): array
    {
        return [
            'country_id' => ['required', 'exists:countries,id'],
            'service_name' => ['required', 'string', 'max:120'],
            'phone_number' => ['required', 'string', 'max:30'],
            'is_emergency' => ['sometimes', 'boolean'],
        ];
    }

    protected function relations(): array
    {
        return ['country'];
    }

    protected function filterable(): array
    {
        return ['country_id', 'is_emergency'];
    }

    protected function searchable(): array
    {
        return ['service_name', 'phone_number'];
    }
}
