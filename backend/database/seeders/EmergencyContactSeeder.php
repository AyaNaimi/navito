<?php

namespace Database\Seeders;

use App\Models\EmergencyContact;
use App\Models\Country;
use Illuminate\Database\Seeder;

class EmergencyContactSeeder extends Seeder
{
    public function run(): void
    {
        $morocco = Country::query()->where('code', 'MA')->first();
        if (!$morocco) return;

        $contacts = [
            ['service_name' => 'Police Nationale', 'phone_number' => '19', 'is_emergency' => true],
            ['service_name' => 'Gendarmerie Royale', 'phone_number' => '177', 'is_emergency' => true],
            ['service_name' => 'Protection Civile', 'phone_number' => '15', 'is_emergency' => true],
            ['service_name' => 'Pompiers', 'phone_number' => '150', 'is_emergency' => true],
            ['service_name' => 'Police Touristique', 'phone_number' => '+212 524 38 20 20', 'is_emergency' => true],
            ['service_name' => 'SAMU', 'phone_number' => '141', 'is_emergency' => true],
            ['service_name' => 'Urgences Medicales', 'phone_number' => '+212 150', 'is_emergency' => true],
            ['service_name' => 'Tourism Police Marrakech', 'phone_number' => '+212 524 38 20 20', 'is_emergency' => true],
            ['service_name' => 'Consulat France Marrakech', 'phone_number' => '+212 524 44 05 05', 'is_emergency' => false],
            ['service_name' => 'Ambassade USA', 'phone_number' => '+212 537 63 72 00', 'is_emergency' => false],
        ];

        foreach ($contacts as $contact) {
            EmergencyContact::query()->updateOrCreate(
                ['country_id' => $morocco->id, 'service_name' => $contact['service_name']],
                $contact
            );
        }
    }
}
