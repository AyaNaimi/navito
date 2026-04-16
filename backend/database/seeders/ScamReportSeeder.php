<?php

namespace Database\Seeders;

use App\Models\ScamReport;
use App\Models\City;
use Illuminate\Database\Seeder;

class ScamReportSeeder extends Seeder
{
    public function run(): void
    {
        $marrakech = City::query()->where('slug', 'marrakech')->first();
        $fes = City::query()->where('slug', 'fes')->first();

        $this->seedScams($marrakech, $fes);
    }

    private function seedScams($marrakech, $fes)
    {
        $scams = [
            [
                'city_id' => $marrakech->id,
                'title' => 'Faux guide dans la Medina',
                'category' => 'fake_guide',
                'description' => 'Des personnes proposent leur aide pour vous guider dans la medina, puis exigent une somme elevee pour ce service non demande.',
                'prevention_tips' => 'Refuser poliment. Privilegier les guides certifies ou agences de voyage. Demander a voir leur badge officiel.',
                'severity' => 'high',
            ],
            [
                'city_id' => $marrakech->id,
                'title' => 'Taxis sans compteur',
                'category' => 'overcharge',
                'description' => 'Certains taxis refusent d utiliser le compteur et proposent des prix arbitraires, souvent 2 a 3 fois le prix normal.',
                'prevention_tips' => 'Exiger le compteur (compteur). Si le chauffeur refuse, descendre et en prendre un autre. Convenir du prix avant.',
                'severity' => 'medium',
            ],
            [
                'city_id' => $marrakech->id,
                'title' => 'Souk des prix fixes',
                'category' => 'overcharge',
                'description' => 'Dans certains souks, les prix sont fixes et non negocies. Vous pouvez etre facturé bien plus que la valeur reelle.',
                'prevention_tips' => 'Se renseigner sur les prix du marche. Negocier fermement. Ne jamais payer le premier prix propose.',
                'severity' => 'medium',
            ],
            [
                'city_id' => $marrakech->id,
                'title' => 'Faux produits artisanaux',
                'category' => 'fake_product',
                'description' => 'Des vendeurs proposent des "tapisseries berberes authentiques" ou "huiles d argan pures" qui sont en realite des imitations.',
                'prevention_tips' => 'Acheter uniquement chez des vendeurs de confiance ou dans des cooperatives. Demander un certificat d authenticite.',
                'severity' => 'medium',
            ],
            [
                'city_id' => $marrakech->id,
                'title' => 'Menage non demande au cafe',
                'category' => 'overcharge',
                'description' => 'On vous apporte des Menage (the a la menthe) ou amuse-gueules sans les demander, puis on presente une facture elevee.',
                'prevention_tips' => 'Specifier explicitement que vous ne desirez rien. Refuser poliment tout ce qui n a pas ete commande.',
                'severity' => 'low',
            ],
            [
                'city_id' => $marrakech->id,
                'title' => 'Change illegal',
                'category' => 'scam',
                'description' => 'Des changeurs de rue proposent des taux avantageux mais rendent de fausses billet ou moins que promis.',
                'prevention_tips' => 'Changer uniquement dans les banques ou les bureaus de change autorises. Compter systematiquement.',
                'severity' => 'high',
            ],
            [
                'city_id' => $marrakech->id,
                'title' => 'Faux raccourcis mosquee',
                'category' => 'fake_guide',
                'description' => 'Quelqu un vous approche en disant que la mosquee est fermee et propose de vous guider ailleurs, puis demande de l argent.',
                'prevention_tips' => 'Les mosquees ne sont pas accessibles aux non-musulmans. Ignorer ces sollicitations.',
                'severity' => 'low',
            ],
            [
                'city_id' => $fes ? $fes->id : null,
                'title' => 'Faux mendiants',
                'category' => 'scam',
                'description' => 'Des "mendiants" professionnel exploitent la sympathie des touristes pour obtenir de l argent.',
                'prevention_tips' => 'Ne pas donner d argent directement. Preferer les dons aux associations caritatives.',
                'severity' => 'low',
            ],
            [
                'city_id' => $marrakech->id,
                'title' => 'Photo payante',
                'category' => 'overcharge',
                'description' => 'Quelqu un propose de prendre une photo avec un animal (singes, serpents) puis demande une somme elevee.',
                'prevention_tips' => 'Eviter ces interactions. Les animaux sont souvent mal traites. Decliner poliment.',
                'severity' => 'medium',
            ],
            [
                'city_id' => $marrakech->id,
                'title' => 'Location de vehicule frauduleuse',
                'category' => 'scam',
                'description' => 'Des agences non autorisees louent des vehicules avec des assurances douteuses et facturent des frais caches.',
                'prevention_tips' => 'Louer uniquement dans des agences reputees. Lire attentivement le contrat. Prendre des photos du vehicule.',
                'severity' => 'high',
            ],
        ];

        foreach ($scams as $scam) {
            ScamReport::query()->updateOrCreate(
                ['title' => $scam['title']],
                $scam
            );
        }
    }
}
