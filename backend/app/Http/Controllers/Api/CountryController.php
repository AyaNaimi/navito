<?php

namespace App\Http\Controllers\Api;

use App\Models\Country;
use Illuminate\Database\Eloquent\Model;

class CountryController extends BaseApiCrudController
{
    protected function modelClass(): string
    {
        return Country::class;
    }

    protected function rules(?Model $model = null): array
    {
        $countryId = $model?->getKey();

        return [
            'name' => ['required', 'string', 'max:120'],
            'code' => ['required', 'string', 'max:10', 'unique:countries,code,'.($countryId ?? 'NULL').',id'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    protected function relations(): array
    {
        return ['cities', 'emergencyContacts'];
    }

    protected function searchable(): array
    {
        return ['name', 'code'];
    }
}
