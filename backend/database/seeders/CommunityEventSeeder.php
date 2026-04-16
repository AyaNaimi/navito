<?php

namespace Database\Seeders;

use App\Models\CommunityEvent;
use App\Models\User;
use App\Models\City;
use Illuminate\Database\Seeder;

class CommunityEventSeeder extends Seeder
{
    public function run(): void
    {
        $marrakech = City::query()->where('slug', 'marrakech')->first();
        $tourist = User::query()->where('email', 'tourist@navito.test')->first();

        if (!$marrakech) return;

        $this->seedEvents($marrakech, $tourist);
    }

    private function seedEvents($marrakech, $organizer)
    {
        $events = [
            [
                'title' => 'Medina Walk Together',
                'description' => 'Petite balade entre voyageurs pour decouvrir les souks caches de la medina. Echanger tips et bonnes adresses !',
                'meetup_point' => 'Cafe de France, Place Jemaa el-Fna',
                'starts_at' => now()->addDays(2)->setTime(17, 0),
                'ends_at' => now()->addDays(2)->setTime(19, 30),
                'min_participants' => 3,
                'max_participants' => 8,
                'level' => 'beginner',
                'status' => 'open',
            ],
            [
                'title' => 'Yoga au Jardin Majorelle',
                'description' => 'Session de yoga douce dans un cadre enchanteur. Tous niveaux Bienvenus. Apportez votre tapis.',
                'meetup_point' => 'Entree principale du Jardin Majorelle',
                'starts_at' => now()->addDays(3)->setTime(8, 0),
                'ends_at' => now()->addDays(3)->setTime(9, 30),
                'min_participants' => 5,
                'max_participants' => 15,
                'level' => 'beginner',
                'status' => 'open',
            ],
            [
                'title' => 'Photographie Urbaine',
                'description' => 'Balade photographique dans Gueliz. Apprenez a capturer l architecture moderne et l atmosphere de Marrakech.',
                'meetup_point' => 'Place du 16 Novembre, Gueliz',
                'starts_at' => now()->addDays(4)->setTime(10, 0),
                'ends_at' => now()->addDays(4)->setTime(13, 0),
                'min_participants' => 4,
                'max_participants' => 10,
                'level' => 'intermediate',
                'status' => 'open',
            ],
            [
                'title' => 'Cours de Darija pour Debutants',
                'description' => 'Apprenez les bases de l arabe marocain (darija) avec d autres voyageurs. Fun et interactif !',
                'meetup_point' => 'Cafe Clock, Derb Chtouka',
                'starts_at' => now()->addDays(5)->setTime(11, 0),
                'ends_at' => now()->addDays(5)->setTime(12, 30),
                'min_participants' => 4,
                'max_participants' => 12,
                'level' => 'beginner',
                'status' => 'open',
            ],
            [
                'title' => 'Sunset Rooftop Meetup',
                'description' => 'Rencontre entre voyageurs sur un rooftop avec vue panoramique sur la ville. Cocktails et snacks partages.',
                'meetup_point' => 'Le Rooftop, Hotel Agafa',
                'starts_at' => now()->addDays(1)->setTime(18, 0),
                'ends_at' => now()->addDays(1)->setTime(21, 0),
                'min_participants' => 5,
                'max_participants' => 20,
                'level' => 'any',
                'status' => 'open',
            ],
            [
                'title' => 'Decouverte des Tartes et Patisseries',
                'description' => 'Balade gustative a travers la medina pour deguster les meilleures patisseries marocaines.',
                'meetup_point' => 'Boucherie Elhouma, Rue des Banques',
                'starts_at' => now()->addDays(6)->setTime(15, 0),
                'ends_at' => now()->addDays(6)->setTime(18, 0),
                'min_participants' => 4,
                'max_participants' => 10,
                'level' => 'beginner',
                'status' => 'open',
            ],
            [
                'title' => 'Artisan Workshop: Poterie',
                'description' => 'Atelier initiatique avec un artisan potier. Fabriquez votre propre piece en argile.',
                'meetup_point' => 'Cooperative Artisanal, Tnine Sidi Ghiate',
                'starts_at' => now()->addDays(7)->setTime(10, 0),
                'ends_at' => now()->addDays(7)->setTime(14, 0),
                'min_participants' => 3,
                'max_participants' => 8,
                'level' => 'any',
                'status' => 'open',
            ],
            [
                'title' => 'Football Match Local',
                'description' => 'Match de foot avec les locaux sur un terrain en plein air. Joignez-vous a nous !',
                'meetup_point' => 'Terrain de foot, Avenue Mohammed VI',
                'starts_at' => now()->addDays(2)->setTime(16, 0),
                'ends_at' => now()->addDays(2)->setTime(18, 0),
                'min_participants' => 6,
                'max_participants' => 22,
                'level' => 'intermediate',
                'status' => 'open',
            ],
        ];

        foreach ($events as $eventData) {
            CommunityEvent::query()->updateOrCreate(
                ['title' => $eventData['title']],
                [
                    'organizer_id' => $organizer ? $organizer->id : 1,
                    'city_id' => $marrakech->id,
                    ...$eventData,
                ]
            );
        }
    }
}
