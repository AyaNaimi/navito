<?php

namespace App\Http\Controllers\Api;

use App\Models\ScamReport;
use Illuminate\Database\Eloquent\Model;

class ScamReportController extends BaseApiCrudController
{
    protected function modelClass(): string
    {
        return ScamReport::class;
    }

    protected function rules(?Model $model = null): array
    {
        return [
            'city_id' => ['nullable', 'exists:cities,id'],
            'title' => ['required', 'string', 'max:180'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'prevention_tips' => ['nullable', 'string'],
            'severity' => ['sometimes', 'in:low,medium,high'],
        ];
    }

    protected function relations(): array
    {
        return ['city.country'];
    }

    protected function filterable(): array
    {
        return ['city_id', 'severity', 'category'];
    }

    protected function searchable(): array
    {
        return ['title', 'category', 'description'];
    }
}
