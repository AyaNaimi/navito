<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['tourist', 'guide', 'driver', 'super_admin'] as $role) {
            Role::query()->updateOrCreate(['name' => $role]);
        }
    }
}
