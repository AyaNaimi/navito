<?php

namespace App\Http\Controllers\Api;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Model;

class ActivityController extends BaseApiCrudController
{
    protected function modelClass(): string
    {
        return Activity::class;
    }

    protected function rules(?Model $model = null): array
    {
        $activityId = $model?->getKey();

        return [
            'city_id' => ['required', 'exists:cities,id'],
            'name' => ['required', 'string', 'max:160'],
            'slug' => ['required', 'string', 'max:180', 'unique:activities,slug,'.($activityId ?? 'NULL').',id'],
            'description' => ['nullable', 'string'],
            'duration_label' => ['nullable', 'string', 'max:80'],
            'price_min' => ['nullable', 'numeric'],
            'price_max' => ['nullable', 'numeric'],
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
        return ['city_id', 'is_published'];
    }

    protected function searchable(): array
    {
        return ['name', 'description', 'duration_label'];
    }
}
