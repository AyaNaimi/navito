<?php

namespace Database\Seeders;

use App\Models\TransportFare;
use App\Models\City;
use Illuminate\Database\Seeder;

class TransportFareSeeder extends Seeder
{
    public function run(): void
    {
        $marrakech = City::query()->where('slug', 'marrakech')->first();
        $fes = City::query()->where('slug', 'fes')->first();
        $casablanca = City::query()->where('slug', 'casablanca')->first();

        $this->seedMarrakechTransport($marrakech);
        $this->seedFesTransport($fes);
        $this->seedCasablancaTransport($casablanca);
    }

    private function seedMarrakechTransport($marrakech)
    {
        if (!$marrakech) return;

        $fares = [
            [
                'city_id' => $marrakech->id,
                'transport_type' => 'petit_taxi',
                'label' => 'Petit Taxi - Centre Ville',
                'price_min' => 15,
                'price_max' => 40,
                'notes' => 'Utiliser le compteur (compteur) si possible. Prix indicatif pour course courte.',
            ],
            [
                'city_id' => $marrakech->id,
                'transport_type' => 'petit_taxi',
                'label' => 'Petit Taxi - Medina vers Gueliz',
                'price_min' => 30,
                'price_max' => 60,
                'notes' => 'Course medina vers quartier moderne. Negocier avant ou demander le compteur.',
            ],
            [
                'city_id' => $marrakech->id,
                'transport_type' => 'grand_taxi',
                'label' => 'Grand Taxi - Trajet Partage',
                'price_min' => 50,
                'price_max' => 150,
                'notes' => 'Taxi collectif pour longue distance. Prix par personne.',
            ],
            [
                'city_id' => $marrakech->id,
                'transport_type' => 'grand_taxi',
                'label' => 'Grand Taxi - Prives',
                'price_min' => 300,
                'price_max' => 800,
                'notes' => 'Location privee du grand taxi pour la journee. Negocier le prix.',
            ],
            [
                'city_id' => $marrakech->id,
                'transport_type' => 'bus',
                'label' => 'Bus Urbain - Ligne 1',
                'price_min' => 4,
                'price_max' => 7,
                'notes' => 'Bus climatises avec arrets dans toute la ville.',
            ],
            [
                'city_id' => $marrakech->id,
                'transport_type' => 'bus',
                'label' => 'Bus CTM - Gare Routiere',
                'price_min' => 50,
                'price_max' => 300,
                'notes' => 'Bus inter-villes. Reserver a l avance recommandee.',
            ],
            [
                'city_id' => $marrakech->id,
                'transport_type' => 'train',
                'label' => 'ONCF - Gare de Marrakech',
                'price_min' => 80,
                'price_max' => 400,
                'notes' => 'Train vers Casablanca, Rabat, Fes. Reserver en ligne ou en gare.',
            ],
        ];

        foreach ($fares as $fare) {
            TransportFare::query()->updateOrCreate(
                ['city_id' => $fare['city_id'], 'label' => $fare['label']],
                $fare
            );
        }
    }

    private function seedFesTransport($fes)
    {
        if (!$fes) return;

        $fares = [
            [
                'city_id' => $fes->id,
                'transport_type' => 'petit_taxi',
                'label' => 'Petit Taxi - Centre Ville',
                'price_min' => 12,
                'price_max' => 35,
                'notes' => 'Course courte en ville. Compteur recommende.',
            ],
            [
                'city_id' => $fes->id,
                'transport_type' => 'petit_taxi',
                'label' => 'Petit Taxi - Ville Nouvelle',
                'price_min' => 20,
                'price_max' => 50,
                'notes' => 'Medina vers Ville Nouvelle. Prix negocie generalement.',
            ],
            [
                'city_id' => $fes->id,
                'transport_type' => 'grand_taxi',
                'label' => 'Grand Taxi - Prives',
                'price_min' => 400,
                'price_max' => 1000,
                'notes' => 'Location privee pour excursions. A negocier.',
            ],
        ];

        foreach ($fares as $fare) {
            TransportFare::query()->updateOrCreate(
                ['city_id' => $fare['city_id'], 'label' => $fare['label']],
                $fare
            );
        }
    }

    private function seedCasablancaTransport($casablanca)
    {
        if (!$casablanca) return;

        $fares = [
            [
                'city_id' => $casablanca->id,
                'transport_type' => 'petit_taxi',
                'label' => 'Petit Taxi - Centre Ville',
                'price_min' => 15,
                'price_max' => 50,
                'notes' => 'Traffic souvent dense. Compteur obligatoire.',
            ],
            [
                'city_id' => $casablanca->id,
                'transport_type' => 'tramway',
                'label' => 'Tramway Casablanca',
                'price_min' => 6,
                'price_max' => 10,
                'notes' => 'Ligne T1 reliant les principaux quartiers. Billet valide 1h.',
            ],
            [
                'city_id' => $casablanca->id,
                'transport_type' => 'bus',
                'label' => 'Bus Casa Transport',
                'price_min' => 5,
                'price_max' => 8,
                'notes' => 'Reseau de bus moderne dans toute la ville.',
            ],
        ];

        foreach ($fares as $fare) {
            TransportFare::query()->updateOrCreate(
                ['city_id' => $fare['city_id'], 'label' => $fare['label']],
                $fare
            );
        }
    }
}
