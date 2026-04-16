<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    public function run(): void
    {
        $tourist = User::query()->where('email', 'tourist@navito.test')->first();
        $guide = User::query()->where('email', 'guide@navito.test')->first();
        $driver = User::query()->where('email', 'driver@navito.test')->first();
        $fatima = User::query()->where('email', 'fatima.guide@navito.test')->first();
        $karim = User::query()->where('email', 'karim.driver@navito.test')->first();

        if (!$tourist) return;

        $this->seedTouristGuideConversation($tourist, $guide);
        $this->seedTouristDriverConversation($tourist, $driver);
        $this->seedTouristFatimaConversation($tourist, $fatima);
        $this->seedTouristKarimConversation($tourist, $karim);
    }

    private function seedTouristGuideConversation($tourist, $guide)
    {
        if (!$guide) return;

        $conversation = Conversation::query()->firstOrCreate(
            [
                'created_by' => $tourist->id,
                'title' => null,
                'is_group' => false,
            ],
            ['last_message_at' => now()->subHours(2)]
        );
        $conversation->participants()->syncWithoutDetaching([$tourist->id, $guide->id]);

        $messages = [
            ['user_id' => $tourist->id, 'body' => 'Bonjour, je voudrais confirmer notre visite guidee de demain.'],
            ['user_id' => $guide->id, 'body' => 'Parfait ! Je vous attends a Jemaa el-Fna a 10h00. Est-ce que 10h vous convient ?'],
            ['user_id' => $tourist->id, 'body' => 'Oui, 10h cest parfait. Dois-je apporter quelque chose ?'],
            ['user_id' => $guide->id, 'body' => 'Apportez de l eau, des chaussures confortables et votre appareil photo !'],
        ];

        $this->addMessages($conversation, $messages);
    }

    private function seedTouristDriverConversation($tourist, $driver)
    {
        if (!$driver) return;

        $conversation = Conversation::query()->firstOrCreate(
            [
                'created_by' => $tourist->id,
                'title' => 'Course Marrakech',
                'is_group' => false,
            ],
            ['last_message_at' => now()->subDays(1)]
        );
        $conversation->participants()->syncWithoutDetaching([$tourist->id, $driver->id]);

        $messages = [
            ['user_id' => $tourist->id, 'body' => 'Bonjour, j ai besoin d un taxi pour aller a l aeroport demain matin.'],
            ['user_id' => $driver->id, 'body' => 'Bien sur ! A quelle heure avez-vous besoin du pickup ?'],
            ['user_id' => $tourist->id, 'body' => 'A 7h30 du matin, depuis Jemaa el-Fna.'],
            ['user_id' => $driver->id, 'body' => 'OK, je serai la a 7h15. Le prix sera de 100 MAD.'],
            ['user_id' => $tourist->id, 'body' => 'Parfait, merci beaucoup !'],
        ];

        $this->addMessages($conversation, $messages);
    }

    private function seedTouristFatimaConversation($tourist, $fatima)
    {
        if (!$fatima) return;

        $conversation = Conversation::query()->firstOrCreate(
            [
                'created_by' => $tourist->id,
                'title' => null,
                'is_group' => false,
            ],
            ['last_message_at' => now()->subDays(2)]
        );
        $conversation->participants()->syncWithoutDetaching([$tourist->id, $fatima->id]);

        $messages = [
            ['user_id' => $tourist->id, 'body' => 'Bonjour Fatima, je suis interesse par un cours de cuisine. Est-ce possible ?'],
            ['user_id' => $fatima->id, 'body' => 'Bonjour ! Bien sur, je propose des cours tous les jours. Quel jour vous arrange ?'],
            ['user_id' => $tourist->id, 'body' => 'Serait-il possible demain apres-midi ?'],
            ['user_id' => $fatima->id, 'body' => 'Demain a 15h00 ? Pas de probleme. Je vous envoie l adresse du riad.'],
        ];

        $this->addMessages($conversation, $messages);
    }

    private function seedTouristKarimConversation($tourist, $karim)
    {
        if (!$karim) return;

        $conversation = Conversation::query()->firstOrCreate(
            [
                'created_by' => $tourist->id,
                'title' => 'Excursion Atlas',
                'is_group' => false,
            ],
            ['last_message_at' => now()->subDays(3)]
        );
        $conversation->participants()->syncWithoutDetaching([$tourist->id, $karim->id]);

        $messages = [
            ['user_id' => $tourist->id, 'body' => 'Bonjour Karim, proposez-vous des excursions dans l Atlas ?'],
            ['user_id' => $karim->id, 'body' => 'Oui ! Je fais des journees complete vers les cascades d Ouzoud. Le prix est de 600 MAD pour 2 personnes.'],
            ['user_id' => $tourist->id, 'body' => 'C est pour 4 personnes finalement. Vous pouvez nous prendre ?'],
            ['user_id' => $karim->id, 'body' => 'Pas de souci ! Prix de 900 MAD pour 4 personnes, de part et d autre.'],
        ];

        $this->addMessages($conversation, $messages);
    }

    private function addMessages($conversation, $messages)
    {
        foreach ($messages as $index => $msgData) {
            $msg = Message::firstOrCreate([
                'conversation_id' => $conversation->id,
                'user_id' => $msgData['user_id'],
                'body' => $msgData['body'],
            ]);
        }
        $conversation->forceFill(['last_message_at' => now()])->save();
    }
}
