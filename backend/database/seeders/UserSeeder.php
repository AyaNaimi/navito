<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\TouristProfile;
use App\Models\GuideProfile;
use App\Models\DriverProfile;
use App\Models\City;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::query()->pluck('id', 'name');
        $marrakech = City::query()->where('slug', 'marrakech')->first();
        $morocco = $marrakech ? $marrakech->country : null;

        $this->seedSuperAdmin($roles);
        $this->seedGuides($roles, $marrakech);
        $this->seedDrivers($roles, $marrakech);
        $this->seedTourists($roles, $marrakech, $morocco);
    }

    private function seedSuperAdmin($roles)
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@navito.test'],
            [
                'name' => 'Navito Admin',
                'password' => Hash::make('password123'),
                'status' => 'active',
                'preferred_language' => 'fr',
            ]
        );
        $admin->roles()->sync([$roles['super_admin']]);
    }

    private function seedGuides($roles, $marrakech)
    {
        $guides = [
            [
                'email' => 'guide@navito.test',
                'name' => 'Ahmed Benali',
                'phone' => '+212 611 111 111',
                'bio' => 'Guide certifie depuis 10 ans. Specialiste de la medina de Marrakech et de l histoire almohade.',
            ],
            [
                'email' => 'fatima.guide@navito.test',
                'name' => 'Fatima Zahra',
                'phone' => '+212 612 222 222',
                'bio' => 'Guide female certifiee. Passionnee par la culture berbere et les traditions artisanales.',
            ],
            [
                'email' => 'youssef.guide@navito.test',
                'name' => 'Youssef Idrissi',
                'phone' => '+212 613 333 333',
                'bio' => 'Guide professionnel. Expert en gastronomie marocaine et circuits desert.',
            ],
        ];

        foreach ($guides as $index => $guideData) {
            $guide = User::query()->updateOrCreate(
                ['email' => $guideData['email']],
                [
                    'name' => $guideData['name'],
                    'password' => Hash::make('password123'),
                    'status' => 'active',
                    'preferred_language' => 'fr',
                ]
            );
            $guide->roles()->sync([$roles['guide']]);
            GuideProfile::query()->updateOrCreate(
                ['user_id' => $guide->id],
                [
                    'city_id' => $marrakech->id,
                    'phone' => $guideData['phone'],
                    'bio' => $guideData['bio'],
                    'status' => 'approved',
                ]
            );
        }
    }

    private function seedDrivers($roles, $marrakech)
    {
        $drivers = [
            [
                'email' => 'driver@navito.test',
                'name' => 'Hassan Tazi',
                'phone' => '+212 622 111 111',
                'vehicle_type' => 'Petit Taxi',
                'vehicle_registration' => '12345-A-7',
            ],
            [
                'email' => 'karim.driver@navito.test',
                'name' => 'Karim Alaoui',
                'phone' => '+212 623 222 222',
                'vehicle_type' => 'Grand Taxi',
                'vehicle_registration' => '67890-B-7',
            ],
            [
                'email' => 'moustapha.driver@navito.test',
                'name' => 'Moustapha Fassi',
                'phone' => '+212 624 333 333',
                'vehicle_type' => 'Van',
                'vehicle_registration' => '11223-C-7',
            ],
        ];

        foreach ($drivers as $driverData) {
            $driver = User::query()->updateOrCreate(
                ['email' => $driverData['email']],
                [
                    'name' => $driverData['name'],
                    'password' => Hash::make('password123'),
                    'status' => 'active',
                    'preferred_language' => 'fr',
                ]
            );
            $driver->roles()->sync([$roles['driver']]);
            DriverProfile::query()->updateOrCreate(
                ['user_id' => $driver->id],
                [
                    'city_id' => $marrakech->id,
                    'phone' => $driverData['phone'],
                    'vehicle_type' => $driverData['vehicle_type'],
                    'vehicle_registration' => $driverData['vehicle_registration'],
                    'verification_status' => 'verified',
                ]
            );
        }
    }

    private function seedTourists($roles, $marrakech, $morocco)
    {
        $tourists = [
            [
                'email' => 'tourist@navito.test',
                'name' => 'Marie Dupont',
                'nationality' => 'French',
                'passport_country' => 'France',
                'phone' => '+212 633 111 111',
                'preferred_language' => 'fr',
            ],
            [
                'email' => 'john.tourist@navito.test',
                'name' => 'John Smith',
                'nationality' => 'British',
                'passport_country' => 'United Kingdom',
                'phone' => '+212 634 222 222',
                'preferred_language' => 'en',
            ],
            [
                'email' => 'maria.tourist@navito.test',
                'name' => 'Maria Garcia',
                'nationality' => 'Spanish',
                'passport_country' => 'Spain',
                'phone' => '+212 635 333 333',
                'preferred_language' => 'es',
            ],
        ];

        foreach ($tourists as $touristData) {
            $tourist = User::query()->updateOrCreate(
                ['email' => $touristData['email']],
                [
                    'name' => $touristData['name'],
                    'password' => Hash::make('password123'),
                    'status' => 'active',
                    'preferred_language' => $touristData['preferred_language'],
                ]
            );
            $tourist->roles()->sync([$roles['tourist']]);
            TouristProfile::query()->updateOrCreate(
                ['user_id' => $tourist->id],
                [
                    'nationality' => $touristData['nationality'],
                    'passport_country' => $touristData['passport_country'],
                    'phone' => $touristData['phone'],
                    'detected_country_id' => $morocco ? $morocco->id : null,
                    'detected_city_id' => $marrakech ? $marrakech->id : null,
                ]
            );
        }
    }
}
