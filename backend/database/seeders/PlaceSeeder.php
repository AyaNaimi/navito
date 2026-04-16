<?php

namespace Database\Seeders;

use App\Models\Place;
use App\Models\Restaurant;
use App\Models\Activity;
use App\Models\City;
use Illuminate\Database\Seeder;

class PlaceSeeder extends Seeder
{
    public function run(): void
    {
        $marrakech = City::query()->where('slug', 'marrakech')->first();
        $fes = City::query()->where('slug', 'fes')->first();
        $casablanca = City::query()->where('slug', 'casablanca')->first();

        $this->seedPlaces($marrakech);
        $this->seedRestaurants($marrakech, $fes, $casablanca);
        $this->seedActivities($marrakech, $fes);
    }

    private function seedPlaces($marrakech)
    {
        $places = [
            [
                'slug' => 'jemaa-el-fna',
                'city_id' => $marrakech->id,
                'name' => 'Jemaa el-Fna',
                'category' => 'market',
                'description' => 'Place centrale legendaire avec souks, restaurants en plein air et animation locale. UNESCO Patrimoine Immatriel.',
                'latitude' => 31.6258,
                'longitude' => -7.9892,
                'address' => 'Medina, Marrakech',
                'opening_hours' => 'Toute la journee',
                'entry_price_min' => 0,
                'entry_price_max' => 0,
                'rating' => 4.7,
                'is_published' => true,
            ],
            [
                'slug' => 'jardin-majorelle',
                'city_id' => $marrakech->id,
                'name' => 'Jardin Majorelle',
                'category' => 'garden',
                'description' => 'Jardin botanique exquis cree par Jacques Majorelle et restaure par Yves Saint Laurent.',
                'latitude' => 31.6418,
                'longitude' => -8.0035,
                'address' => 'Avenue Yacoub el Mansour, Marrakech',
                'opening_hours' => '08:00-18:00',
                'entry_price_min' => 70,
                'entry_price_max' => 150,
                'rating' => 4.8,
                'is_published' => true,
            ],
            [
                'slug' => 'koutoubia',
                'city_id' => $marrakech->id,
                'name' => 'Mosquee Koutoubia',
                'category' => 'monument',
                'description' => 'La plus grande mosquee de Marrakech avec son minaret emblematique de 77 metres.',
                'latitude' => 31.6219,
                'longitude' => -7.9889,
                'address' => 'Avenue Mohammed V, Marrakech',
                'opening_hours' => 'Non accessibles aux non-musulmans',
                'entry_price_min' => 0,
                'entry_price_max' => 0,
                'rating' => 4.6,
                'is_published' => true,
            ],
            [
                'slug' => 'palais-bahia',
                'city_id' => $marrakech->id,
                'name' => 'Palais Bahia',
                'category' => 'palace',
                'description' => 'Magnifique palais du 19eme siecle avec architecture traditionnelle marocaine.',
                'latitude' => 31.6188,
                'longitude' => -7.9827,
                'address' => 'Derb N1, Riad Zitoun, Marrakech',
                'opening_hours' => '09:00-17:00',
                'entry_price_min' => 70,
                'entry_price_max' => 130,
                'rating' => 4.7,
                'is_published' => true,
            ],
            [
                'slug' => 'medersa-ben-youssef',
                'city_id' => $marrakech->id,
                'name' => 'Medersa Ben Youssef',
                'category' => 'monument',
                'description' => 'Ancienne universite coranique datant du 14eme siecle, chef-d oeuvre de l architecture marinide.',
                'latitude' => 31.6329,
                'longitude' => -7.9873,
                'address' => 'Place Ben Youssef, Medina, Marrakech',
                'opening_hours' => '09:00-18:00',
                'entry_price_min' => 50,
                'entry_price_max' => 100,
                'rating' => 4.5,
                'is_published' => true,
            ],
            [
                'slug' => 'souk-des-epices',
                'city_id' => $marrakech->id,
                'name' => 'Souk des Epices',
                'category' => 'market',
                'description' => 'Marche aux epices colore avec parfums de cumin, paprika, cannelle et curcuma.',
                'latitude' => 31.6295,
                'longitude' => -7.9865,
                'address' => 'Medina, Marrakech',
                'opening_hours' => '09:00-19:00',
                'entry_price_min' => 0,
                'entry_price_max' => 0,
                'rating' => 4.3,
                'is_published' => true,
            ],
        ];

        foreach ($places as $place) {
            Place::query()->updateOrCreate(['slug' => $place['slug']], $place);
        }
    }

    private function seedRestaurants($marrakech, $fes, $casablanca)
    {
        $restaurants = [
            [
                'slug' => 'riad-zellij-kitchen',
                'city_id' => $marrakech->id,
                'name' => 'Riad Zellij Kitchen',
                'cuisine' => 'Moroccan',
                'average_price' => 160,
                'rating' => 4.6,
                'is_halal' => true,
                'latitude' => 31.6291,
                'longitude' => -7.9854,
                'address' => 'Medina, Marrakech',
                'opening_hours' => '12:00-23:00',
                'phone' => '+212 600 000 000',
                'is_published' => true,
            ],
            [
                'slug' => 'le-toque',
                'city_id' => $marrakech->id,
                'name' => 'Le Toque',
                'cuisine' => 'French',
                'average_price' => 350,
                'rating' => 4.8,
                'is_halal' => false,
                'latitude' => 31.6350,
                'longitude' => -7.9898,
                'address' => 'Hivernage, Marrakech',
                'opening_hours' => '19:00-23:00',
                'phone' => '+212 600 000 001',
                'is_published' => true,
            ],
            [
                'slug' => 'dar-yacout',
                'city_id' => $marrakech->id,
                'name' => 'Dar Yacout',
                'cuisine' => 'Moroccan',
                'average_price' => 250,
                'rating' => 4.7,
                'is_halal' => true,
                'latitude' => 31.6280,
                'longitude' => -7.9840,
                'address' => 'Derb Sidi Ahmed Tijanis, Medina',
                'opening_hours' => '12:00-22:00',
                'phone' => '+212 600 000 002',
                'is_published' => true,
            ],
            [
                'slug' => 'pape-pizza',
                'city_id' => $marrakech->id,
                'name' => 'Pape Pizza',
                'cuisine' => 'Pizza',
                'average_price' => 80,
                'rating' => 4.2,
                'is_halal' => true,
                'latitude' => 31.6300,
                'longitude' => -7.9900,
                'address' => 'Avenue Mohammed V, Gueliz',
                'opening_hours' => '11:00-23:00',
                'phone' => '+212 600 000 003',
                'is_published' => true,
            ],
            [
                'slug' => 'cafe-de-france',
                'city_id' => $marrakech->id,
                'name' => 'Cafe de France',
                'cuisine' => 'International',
                'average_price' => 120,
                'rating' => 4.4,
                'is_halal' => true,
                'latitude' => 31.6255,
                'longitude' => -7.9895,
                'address' => 'Place Jemaa el-Fna, Marrakech',
                'opening_hours' => '07:00-00:00',
                'phone' => '+212 600 000 004',
                'is_published' => true,
            ],
            [
                'slug' => 'restaurant-kaid',
                'city_id' => $marrakech->id,
                'name' => 'Restaurant Kaid',
                'cuisine' => 'Moroccan',
                'average_price' => 200,
                'rating' => 4.5,
                'is_halal' => true,
                'latitude' => 31.6320,
                'longitude' => -7.9870,
                'address' => 'Derb Snane, Medina',
                'opening_hours' => '12:00-22:00',
                'phone' => '+212 600 000 005',
                'is_published' => true,
            ],
        ];

        foreach ($restaurants as $restaurant) {
            Restaurant::query()->updateOrCreate(['slug' => $restaurant['slug']], $restaurant);
        }
    }

    private function seedActivities($marrakech, $fes)
    {
        $activities = [
            [
                'slug' => 'desert-sunset-tour',
                'city_id' => $marrakech->id,
                'name' => 'Desert Sunset Tour',
                'description' => 'Excursion au coucher du soleil dans les dunes de l Agafay avec coucher de soleil et diner traditionnel.',
                'duration_label' => '4h',
                'price_min' => 250,
                'price_max' => 450,
                'rating' => 4.8,
                'is_published' => true,
            ],
            [
                'slug' => 'cooking-class',
                'city_id' => $marrakech->id,
                'name' => 'Cours de Cuisine Marocaine',
                'description' => 'Apprenez a preparer un tajine authentique et des couscous avec un chef local.',
                'duration_label' => '3h',
                'price_min' => 350,
                'price_max' => 600,
                'rating' => 4.9,
                'is_published' => true,
            ],
            [
                'slug' => 'hot-air-balloon',
                'city_id' => $marrakech->id,
                'name' => 'Ballon Aerien au Lever du Soleil',
                'description' => 'Survolez Marrakech et ses environs au lever du soleil pour une vue panoramique exceptionnelle.',
                'duration_label' => '5h',
                'price_min' => 800,
                'price_max' => 1200,
                'rating' => 4.9,
                'is_published' => true,
            ],
            [
                'slug' => 'atv-adventure',
                'city_id' => $marrakech->id,
                'name' => 'Aventure en Quad dans le Desert',
                'description' => 'Parcourez les chemins desertiques autour de Marrakech en quad avec guide.',
                'duration_label' => '3h',
                'price_min' => 400,
                'price_max' => 650,
                'rating' => 4.7,
                'is_published' => true,
            ],
            [
                'slug' => 'hammam-traditional',
                'city_id' => $marrakech->id,
                'name' => 'Hammam Traditionnel + Massage',
                'description' => 'Experience de bain marocain traditionnel avec gommage au savon noir et massage a l huile d argan.',
                'duration_label' => '2h',
                'price_min' => 300,
                'price_max' => 500,
                'rating' => 4.6,
                'is_published' => true,
            ],
            [
                'slug' => 'souk-tour',
                'city_id' => $marrakech->id,
                'name' => 'Tour Guide des Souks',
                'description' => 'Visite guidee privee des souks de la medina avec explications historiques et culturelles.',
                'duration_label' => '3h',
                'price_min' => 200,
                'price_max' => 400,
                'rating' => 4.8,
                'is_published' => true,
            ],
            [
                'slug' => 'day-trip-atlas',
                'city_id' => $marrakech->id,
                'name' => 'Excursion dans l Atlas',
                'description' => 'Journee dans les montagnes de l Atlas, villages berberes et cascade d Ouzoud.',
                'duration_label' => '8h',
                'price_min' => 500,
                'price_max' => 800,
                'rating' => 4.9,
                'is_published' => true,
            ],
        ];

        foreach ($activities as $activity) {
            Activity::query()->updateOrCreate(['slug' => $activity['slug']], $activity);
        }
    }
}
