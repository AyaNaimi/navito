<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\City;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $activities = [
            [
                'city_slug' => 'marrakech',
                'name' => 'Medina Walking Tour',
                'slug' => 'medina-walking-tour',
                'description' => 'Decouvrez les souks, riads et passages historiques de la medina avec un itineraire pense pour les touristes et les guides locaux.',
                'duration_label' => '3h',
                'price_min' => 180,
                'price_max' => 300,
                'rating' => 4.8,
                'is_published' => true,
            ],
            [
                'city_slug' => 'marrakech',
                'name' => 'Jardin Majorelle et Musees',
                'slug' => 'jardin-majorelle-et-musees',
                'description' => 'Parcours culturel autour du Jardin Majorelle, du Musee Yves Saint Laurent et des adresses artistiques voisines.',
                'duration_label' => '2h30',
                'price_min' => 120,
                'price_max' => 220,
                'rating' => 4.6,
                'is_published' => true,
            ],
            [
                'city_slug' => 'fes',
                'name' => 'Visite des Tanneries de Fes',
                'slug' => 'visite-des-tanneries-de-fes',
                'description' => 'Immersion dans la vieille ville de Fes avec arret aux tanneries, medersas et ateliers d artisanat.',
                'duration_label' => '4h',
                'price_min' => 200,
                'price_max' => 320,
                'rating' => 4.7,
                'is_published' => true,
            ],
            [
                'city_slug' => 'casablanca',
                'name' => 'Casablanca Architecture Tour',
                'slug' => 'casablanca-architecture-tour',
                'description' => 'Circuit urbain autour du centre art deco, de la corniche et des incontournables modernes de Casablanca.',
                'duration_label' => '3h30',
                'price_min' => 150,
                'price_max' => 260,
                'rating' => 4.5,
                'is_published' => true,
            ],
            [
                'city_slug' => 'agadir',
                'name' => 'Surf et Balade Cotiere',
                'slug' => 'surf-et-balade-cotiere',
                'description' => 'Session douce pour voyageurs debutants entre plage, promenade et pauses panoramiques sur la cote.',
                'duration_label' => '5h',
                'price_min' => 250,
                'price_max' => 420,
                'rating' => 4.9,
                'is_published' => true,
            ],
            [
                'city_slug' => 'tangier',
                'name' => 'Tangier Kasbah Experience',
                'slug' => 'tangier-kasbah-experience',
                'description' => 'Promenade historique dans la kasbah, les cafes legendaires et les points de vue sur le detroit.',
                'duration_label' => '3h',
                'price_min' => 170,
                'price_max' => 280,
                'rating' => 4.7,
                'is_published' => true,
            ],
        ];

        foreach ($activities as $activityData) {
            $city = City::query()->where('slug', $activityData['city_slug'])->first();

            if (! $city) {
                continue;
            }

            Activity::query()->updateOrCreate(
                ['slug' => $activityData['slug']],
                [
                    'city_id' => $city->id,
                    'name' => $activityData['name'],
                    'description' => $activityData['description'],
                    'duration_label' => $activityData['duration_label'],
                    'price_min' => $activityData['price_min'],
                    'price_max' => $activityData['price_max'],
                    'rating' => $activityData['rating'],
                    'is_published' => $activityData['is_published'],
                ]
            );
        }
    }
}
