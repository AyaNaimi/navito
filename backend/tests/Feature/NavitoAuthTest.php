<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NavitoAuthTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_user_can_register_and_receive_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New Tourist',
            'email' => 'new-tourist@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'tourist',
            'preferred_language' => 'fr',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'message',
                'token',
                'user' => ['id', 'name', 'email', 'role', 'roles'],
            ])
            ->assertJsonPath('user.role', 'tourist');
    }

    public function test_seeded_super_admin_can_login_and_fetch_dashboard(): void
    {
        $login = $this->postJson('/api/login', [
            'email' => 'admin@navito.test',
            'password' => 'password123',
            'role' => 'super_admin',
        ]);

        $token = $login->json('token');

        $this->assertNotEmpty($token);

        $this->withToken($token)
            ->getJson('/api/me/dashboard')
            ->assertOk()
            ->assertJsonPath('data.role', 'super_admin')
            ->assertJsonStructure([
                'data' => [
                    'role',
                    'stats' => ['users', 'places', 'activities', 'restaurants', 'community_events', 'pending_guide_requests'],
                ],
            ]);
    }
}
