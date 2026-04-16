<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CountryCitySeeder::class,
            EmergencyContactSeeder::class,
            PlaceSeeder::class,
            ActivitySeeder::class,
            TransportFareSeeder::class,
            ScamReportSeeder::class,
            UserSeeder::class,
            CommunityEventSeeder::class,
            ConversationSeeder::class,
        ]);
    }
}
