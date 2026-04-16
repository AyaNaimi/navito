<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

abstract class BaseApiCrudController extends Controller
{
    abstract protected function modelClass(): string;

    abstract protected function rules(?Model $model = null): array;

    protected function relations(): array
    {
        return [];
    }

    protected function filterable(): array
    {
        return [];
    }

    protected function searchable(): array
    {
        return [];
    }

    protected function resourceLabel(): string
    {
        return class_basename($this->modelClass());
    }

    public function index(Request $request): JsonResponse
    {
        $modelClass = $this->modelClass();
        $query = $modelClass::query()->with($this->relations());

        foreach ($this->filterable() as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->input($field));
            }
        }

        if ($request->filled('search') && $this->searchable() !== []) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search): void {
                foreach ($this->searchable() as $index => $field) {
                    if ($index === 0) {
                        $builder->where($field, 'like', "%{$search}%");
                    } else {
                        $builder->orWhere($field, 'like', "%{$search}%");
                    }
                }
            });
        }

        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc') === 'desc' ? 'desc' : 'asc';
        $query->orderBy($sort, $direction);

        return response()->json(['data' => $query->get()]);
    }

    public function show(string $id): JsonResponse
    {
        $modelClass = $this->modelClass();
        $model = $modelClass::query()->with($this->relations())->findOrFail($id);

        return response()->json(['data' => $model]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $modelClass = $this->modelClass();
        $record = $modelClass::create($validated);

        return response()->json([
            'message' => $this->resourceLabel().' created successfully.',
            'data' => $record->load($this->relations()),
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $modelClass = $this->modelClass();
        $model = $modelClass::query()->findOrFail($id);
        $validated = $request->validate($this->rules($model));
        $model->update($validated);

        return response()->json([
            'message' => $this->resourceLabel().' updated successfully.',
            'data' => $model->load($this->relations()),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $modelClass = $this->modelClass();
        $model = $modelClass::query()->findOrFail($id);
        $model->delete();

        return response()->json(['message' => $this->resourceLabel().' deleted successfully.']);
    }
}
