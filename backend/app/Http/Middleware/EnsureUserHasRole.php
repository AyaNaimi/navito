<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user()?->loadMissing('roles');

        if (! $user) {
            return new JsonResponse(['message' => 'Unauthenticated.'], 401);
        }

        if ($roles !== [] && ! $user->hasAnyRole($roles)) {
            return new JsonResponse([
                'message' => 'Access denied for this role.',
                'required_roles' => $roles,
                'current_role' => $user->primaryRole(),
            ], 403);
        }

        return $next($request);
    }
}
