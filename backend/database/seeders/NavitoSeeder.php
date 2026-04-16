<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\City;
use App\Models\CommunityEvent;
use App\Models\Country;
use App\Models\DriverProfile;
use App\Models\DriverRequest;
use App\Models\EmergencyContact;
use App\Models\GuideProfile;
use App\Models\GuideRequest;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Place;
use App\Models\Restaurant;
use App\Models\Role;
use App\Models\ScamReport;
use App\Models\TouristProfile;
use App\Models\TransportFare;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class NavitoSeeder extends Seeder
{
    public function run(): void
    {
        $morocco = Country::query()->updateOrCreate(['code' => 'MA'], ['name' => 'Morocco', 'is_active' => true]);

        $marrakech = City::query()->updateOrCreate(
            ['slug' => 'marrakech'],
            ['country_id' => $morocco->id, 'name' => 'Marrakech', 'latitude' => 31.6295, 'longitude' => -7.9811, 'is_supported' => true]
        );

        foreach ([
            ['slug' => 'fes', 'name' => 'Fes', 'latitude' => 34.0181, 'longitude' => -5.0078],
            ['slug' => 'casablanca', 'name' => 'Casablanca', 'latitude' => 33.5731, 'longitude' => -7.5898],
            ['slug' => 'tangier', 'name' => 'Tangier', 'latitude' => 35.7595, 'longitude' => -5.8340],
            ['slug' => 'agadir', 'name' => 'Agadir', 'latitude' => 30.4278, 'longitude' => -9.5981],
            ['slug' => 'rabat', 'name' => 'Rabat', 'latitude' => 34.0209, 'longitude' => -6.8416],
        ] as $city) {
            City::query()->updateOrCreate(['slug' => $city['slug']], [...$city, 'country_id' => $morocco->id, 'is_supported' => true]);
        }

        foreach ([
            ['service_name' => 'Police', 'phone_number' => '19'],
            ['service_name' => 'Gendarmerie Royale', 'phone_number' => '177'],
            ['service_name' => 'Ambulance', 'phone_number' => '15'],
            ['service_name' => 'Protection civile', 'phone_number' => '150'],
        ] as $contact) {
            EmergencyContact::query()->updateOrCreate(
                ['country_id' => $morocco->id, 'service_name' => $contact['service_name']],
                [...$contact, 'country_id' => $morocco->id, 'is_emergency' => true]
            );
        }

        Place::query()->updateOrCreate(
            ['slug' => 'jemaa-el-fna'],
            [
                'city_id' => $marrakech->id,
                'name' => 'Jemaa el-Fna',
                'category' => 'market',
                'description' => 'Place centrale avec souks, restaurants et animation locale.',
                'latitude' => 31.6258,
                'longitude' => -7.9892,
                'address' => 'Medina, Marrakech',
                'opening_hours' => 'Toute la journee',
                'entry_price_min' => 0,
                'entry_price_max' => 0,
                'rating' => 4.7,
                'is_published' => true,
            ]
        );

        Activity::query()->updateOrCreate(
            ['slug' => 'desert-sunset-tour'],
            [
                'city_id' => $marrakech->id,
                'name' => 'Desert Sunset Tour',
                'description' => 'Excursion courte au coucher du soleil pour touristes.',
                'duration_label' => '4h',
                'price_min' => 250,
                'price_max' => 450,
                'rating' => 4.8,
                'is_published' => true,
            ]
        );

        Restaurant::query()->updateOrCreate(
            ['slug' => 'riad-zellij-kitchen'],
            [
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
                'phone' => '+212600000000',
                'is_published' => true,
            ]
        );

        TransportFare::query()->updateOrCreate(
            ['city_id' => $marrakech->id, 'label' => 'Petit taxi centre-ville'],
            ['transport_type' => 'petit_taxi', 'price_min' => 15, 'price_max' => 40, 'notes' => 'Utiliser le compteur si possible.']
        );

        ScamReport::query()->updateOrCreate(
            ['title' => 'Faux guide dans la medina'],
            [
                'city_id' => $marrakech->id,
                'category' => 'fake_guide',
                'description' => 'Certaines personnes proposent une aide non officielle puis demandent un paiement eleve.',
                'prevention_tips' => 'Refuser poliment et privilegier les guides ou agences verifies.',
                'severity' => 'high',
            ]
        );

        $roles = Role::query()->pluck('id', 'name');

        $superAdmin = User::query()->updateOrCreate(
            ['email' => 'admin@navito.test'],
            ['name' => 'Navito Admin', 'password' => Hash::make('password123'), 'status' => 'active', 'preferred_language' => 'fr', 'last_country_id' => $morocco->id, 'last_city_id' => $marrakech->id]
        );
        $superAdmin->roles()->sync([$roles['super_admin']]);

        $guide = User::query()->updateOrCreate(
            ['email' => 'guide@navito.test'],
            ['name' => 'Guide Marrakech', 'password' => Hash::make('password123'), 'status' => 'active', 'preferred_language' => 'fr', 'last_country_id' => $morocco->id, 'last_city_id' => $marrakech->id]
        );
        $guide->roles()->sync([$roles['guide']]);
        GuideProfile::query()->updateOrCreate(['user_id' => $guide->id], ['city_id' => $marrakech->id, 'phone' => '+212611111111', 'bio' => 'Guide local francophone.', 'status' => 'approved']);

        $driver = User::query()->updateOrCreate(
            ['email' => 'driver@navito.test'],
            ['name' => 'Driver Marrakech', 'password' => Hash::make('password123'), 'status' => 'active', 'preferred_language' => 'fr', 'last_country_id' => $morocco->id, 'last_city_id' => $marrakech->id]
        );
        $driver->roles()->sync([$roles['driver']]);
        DriverProfile::query()->updateOrCreate(['user_id' => $driver->id], ['city_id' => $marrakech->id, 'phone' => '+212622222222', 'vehicle_type' => 'Petit taxi', 'vehicle_registration' => '12345-A-7', 'verification_status' => 'verified']);

        $tourist = User::query()->updateOrCreate(
            ['email' => 'tourist@navito.test'],
            ['name' => 'Tourist Navito', 'password' => Hash::make('password123'), 'status' => 'active', 'preferred_language' => 'en', 'last_country_id' => $morocco->id, 'last_city_id' => $marrakech->id]
        );
        $tourist->roles()->sync([$roles['tourist']]);
        TouristProfile::query()->updateOrCreate(['user_id' => $tourist->id], ['nationality' => 'French', 'passport_country' => 'France', 'phone' => '+212633333333', 'detected_country_id' => $morocco->id, 'detected_city_id' => $marrakech->id]);

        GuideRequest::query()->updateOrCreate(
            [
                'tourist_id' => $tourist->id,
                'guide_id' => $guide->id,
                'city_id' => $marrakech->id,
            ],
            [
                'travel_date' => now()->addDays(2)->toDateString(),
                'notes' => 'Visite de la medina et des souks, en francais.',
                'status' => 'pending',
            ]
        );

        DriverRequest::query()->updateOrCreate(
            [
                'tourist_id' => $tourist->id,
                'driver_id' => $driver->id,
                'city_id' => $marrakech->id,
            ],
            [
                'pickup_location' => 'Jemaa el-Fna',
                'destination' => 'Jardin Majorelle',
                'travel_date' => now()->addDay()->toDateString(),
                'notes' => 'Petit taxi pour deux personnes.',
                'status' => 'pending',
            ]
        );

        CommunityEvent::query()->updateOrCreate(
            ['title' => 'Medina Walk Together'],
            [
                'organizer_id' => $tourist->id,
                'city_id' => $marrakech->id,
                'description' => 'Petite balade entre touristes pour decouvrir la medina.',
                'meetup_point' => 'Jemaa el-Fna',
                'starts_at' => now()->addDay()->setTime(17, 0),
                'ends_at' => now()->addDay()->setTime(19, 0),
                'min_participants' => 2,
                'max_participants' => 8,
                'level' => 'beginner',
                'status' => 'open',
            ]
        );

        $conversation = Conversation::query()->firstOrCreate(
            ['created_by' => $tourist->id, 'title' => null, 'is_group' => false],
            ['last_message_at' => now()]
        );
        $conversation->participants()->syncWithoutDetaching([$tourist->id, $guide->id]);

        if (! $conversation->messages()->exists()) {
            Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $tourist->id,
                'body' => 'Bonjour, je voudrais confirmer notre visite guidee de demain.',
            ]);
            Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $guide->id,
                'body' => 'Parfait, je vous attends a Jemaa el-Fna a 10h00.',
            ]);
            $conversation->forceFill(['last_message_at' => now()])->save();
        }
    }
}
