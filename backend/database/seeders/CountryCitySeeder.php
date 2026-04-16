<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\City;
use Illuminate\Database\Seeder;

class CountryCitySeeder extends Seeder
{
    public function run(): void
    {
        $morocco = Country::query()->updateOrCreate(
            ['code' => 'MA'],
            ['name' => 'Morocco', 'is_active' => true]
        );

        $cities = [
            [
                'slug' => 'marrakech',
                'name' => 'Marrakech',
                'latitude' => 31.6295,
                'longitude' => -7.9811,
                'is_supported' => true,
            ],
            [
                'slug' => 'fes',
                'name' => 'Fes',
                'latitude' => 34.0181,
                'longitude' => -5.0078,
                'is_supported' => true,
            ],
            [
                'slug' => 'casablanca',
                'name' => 'Casablanca',
                'latitude' => 33.5731,
                'longitude' => -7.5898,
                'is_supported' => true,
            ],
            [
                'slug' => 'tangier',
                'name' => 'Tangier',
                'latitude' => 35.7595,
                'longitude' => -5.8340,
                'is_supported' => true,
            ],
            [
                'slug' => 'agadir',
                'name' => 'Agadir',
                'latitude' => 30.4278,
                'longitude' => -9.5981,
                'is_supported' => true,
            ],
            [
                'slug' => 'rabat',
                'name' => 'Rabat',
                'latitude' => 34.0209,
                'longitude' => -6.8416,
                'is_supported' => true,
            ],
            [
                'slug' => 'essaouira',
                'name' => 'Essaouira',
                'latitude' => 31.5085,
                'longitude' => -9.7595,
                'is_supported' => false,
            ],
            [
                'slug' => 'ouarzazate',
                'name' => 'Ouarzazate',
                'latitude' => 30.9230,
                'longitude' => -6.9040,
                'is_supported' => false,
            ],
        ];

        foreach ($cities as $city) {
            City::query()->updateOrCreate(
                ['slug' => $city['slug']],
                [...$city, 'country_id' => $morocco->id]
            );
        }
    }
}
