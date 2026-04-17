
CAHIER DES CHARGES
Navito : Travel Assistant
Plateforme d'assistance numérique pour touristes au Maroc

  
1. Présentation du Projet
1.1. Contexte
L'application NAVITO Travel Assistant est une plateforme web  destinée aux touristes locaux et étrangers visitant le Maroc. Elle vise à centraliser les informations essentielles dont les voyageurs peuvent avoir besoin lors de leurs déplacements dans différentes villes marocaines.

Le tourisme au Maroc représente un secteur économique stratégique. Avec plus de 14 millions de visiteurs étrangers enregistrés annuellement, le pays fait face à un enjeu croissant : améliorer l'expérience numérique des touristes. Pourtant, il n'existe pas à ce jour d'application gratuite, open-source et multilingue capable de répondre à l'ensemble des besoins pratiques d'un voyageur au Maroc.

Les touristes rencontrent fréquemment les difficultés suivantes :
•	Manque d'informations fiables sur les lieux touristiques
•	Difficulté à connaître les prix moyens des services locaux (taxis, restaurants, souks)
•	Barrière linguistique (arabe dialectal, darija, berbère, français)
•	Difficulté à trouver rapidement les numéros d'urgence en cas d'incident
•	Risques d'arnaques dans certaines zones touristiques très fréquentées
•	Absence d'outil de mise en relation simple entre touristes

.Public cible
Touristes étrangers (Europe, Amérique du Nord, Asie..) visitant les grandes villes : Marrakech, Fès, Casablanca, Tanger, Agadir, Rabat.
Touristes internes (Marocains voyageant dans d'autres régions du pays).
Niveau technique supposé : utilisateur courant de smartphone, sans expertise particulière.

1.2. Objectifs
Le projet vise plusieurs objectifs stratégiques pour enrichir l'expérience touristique au Maroc :
•	Faciliter la navigation et la découverte : des richesses culturelles et naturelles du pays via un accès aisé à des informations géolocalisées.
•	Prévenir les situations d'arnaque : en diffusant des conseils pratiques, des alertes et des fourchettes de prix de référence.
•	Clarifier la structure des prix locaux : pour les services courants (taxis, restaurants, hébergements, souvenirs), permettant aux touristes de mieux gérer leur budget.
•	Servir de guide exhaustif : pour les restaurants, les monuments historiques, les sites naturels et les points d'intérêt.
•	Intégrer des fonctionnalités d'assistance linguistique : notamment pour la traduction de panneaux, de menus et de phrases courantes.
•	Développer une application réaliste et réalisable : par une équipe étudiante, en s'appuyant exclusivement sur des technologies gratuites et open-source.
 
2. Fonctionnalités
2.1. Fonctionnalités Principales
2.1.1. Détection de la ville
L'application intègre un mécanisme de détection automatique de la ville où se trouve le touriste, exploitant l'API Geolocation du navigateur (HTML5). Cette fonctionnalité permet d'adapter dynamiquement le contenu affiché, en présentant des informations spécifiques à la ville détectée : monuments, restaurants, transports et conseils locaux personnalisés.

En cas de refus de géolocalisation par l'utilisateur, un menu déroulant permettra de sélectionner la ville manuellement.

2.1.2. Guide des transports
Cette section est dédiée à fournir des informations pratiques concernant les divers modes de transport disponibles au Maroc :
•	Taxis (petits taxis) : informations sur les zones de prise en charge, tarifs moyens par trajet, conseils pour éviter les tarifs excessifs et les arnaques.
•	Grand taxi et taxis collectifs : information sur les principales routes inter-villes desservies, prix moyens négociés.
•	Bus urbains (M'dina Bus, Alsa) : lignes principales disponibles selon la ville, horaires indicatifs.
•	Trains ONCF : liaisons ferroviaires inter-villes, gares principales, tarifs indicatifs. Lien vers le site ONCF pour la réservation.
•	CTM / Supratours : principales lignes de bus longue distance, tarifs et informations pratiques.
•	Simulateur de prix taxi : fonctionnalité dédiée permettant d'estimer le coût moyen d'un trajet (voir se.

2.1.3. Restaurants
Une liste détaillée de restaurants sera accessible, comprenant pour chaque établissement :
•	Nom de l'établissement et type de cuisine (marocaine traditionnelle, internationale, végétarienne, etc.)
•	Estimation du prix moyen par personne (en MAD)
•	Note de satisfaction (système d'étoiles ou score sur 5)
•	Localisation sur carte interactive 
•	Horaires d'ouverture et informations de contact
•	Indication halal / non-halal le cas échéant

Des filtres de recherche permettront d'affiner les résultats par : ville, gamme de prix, type de cuisine, note minimale et quartier. Les données proviendront d'OpenStreetMap ou d'une base de données interne constituée par l'équipe.

2.1.4. Monuments et lieux touristiques
Cette section présentera une sélection de monuments et de sites d'intérêt, enrichie de :
•	Descriptions culturelles et historiques détaillées
•	Horaires d'ouverture et prix d'entrée (adulte / enfant / étudiant)
•	Conseils pratiques pour la visite (tenue vestimentaire recommandée, périodes à éviter, durée conseillée)
•	Carte interactive OpenStreetMap pour la localisation et la planification d'itinéraires
•	Photos illustratives (libres de droits)

2.1.5. Numéros d'urgence
L'application affichera une liste des numéros d'urgence essentiels, directement accessibles même hors connexion :
Service	Numéro
Police 	19
Gendarmerie Royale	177
Ambulance	15
Pompiers	15
Protection civile	150

Un bouton d'appel direct sera disponible pour chaque numéro. Ces données seront accessibles hors ligne.

2.1.6. Guide anti-arnaques
Un guide complet informera les touristes sur les arnaques les plus fréquemment signalées au Maroc :
•	Faux guides touristiques : identification, comment refuser poliment, alternatives officielles.
•	Taxis non compteurs : comment insister sur l'utilisation du compteur, tarifs de référence.
•	Tarifs gonflés dans les souks : fourchettes de prix indicatives pour les articles courants (babouches, tapis, épices, cuir).
•	Arnaques à la photo : pratiques connues dans certaines médinas, comment les éviter.
•	Faux vendeurs de plans et de cartes : comment identifier et éviter.
•	Arnaques à la change : taux de change officiels vs taux de rue, où changer légalement.

2.1.7. Organisation de sorties entre touristes
Une fonctionnalité communautaire simple permettra aux utilisateurs de proposer des sorties ou des activités de groupe (visite de médina, excursion dans le désert, randonnée, etc.). Chaque proposition inclura :
•	Titre et description de l'activité
•	Ville et lieu de rendez-vous
•	Date, heure et durée estimée
•	Nombre de participants minimum/maximum souhaité
•	Niveau requis (débutant, intermédiaire, sportif)

Les autres utilisateurs pourront consulter les propositions actives, rejoindre une sortie, et contacter l'organisateur via un système de messagerie interne simple. Une modération légère sera assurée pour éviter les abus.

2.2. Fonctionnalités IA
Les fonctionnalités basées sur l'intelligence artificielle seront intégrées de manière pragmatique, en privilégiant des solutions simples, locales et open-source, afin de respecter les contraintes budgétaires et techniques du projet étudiant.

2.2.1. OCR et Traduction de panneaux
Cette fonctionnalité permettra aux utilisateurs de photographier un panneau, un menu ou tout texte écrit. Le processus sera le suivant :
•	Capture photo depuis l'interface web (via l'API Camera du navigateur)
•	Extraction du texte via Tesseract.js (version JavaScript de Tesseract OCR, intégrable sans serveur)
•	Traduction automatique via une bibliothèque open-source ou une API gratuite (LibreTranslate ou MyMemory API)
•	Affichage du texte original et de sa traduction côte à côte

Langues prises en charge : arabe (Standard et Maghrébin), français, anglais. L'espagnol et l'allemand seront envisagés dans les améliorations futures.

2.2.2. Estimation de prix via photo
Cette fonction permettra à l'utilisateur de photographier un produit courant (bouteille d'eau, jus, sandwich, souvenir). Le pipeline de traitement sera :
•	Classification d'image via un modèle léger pré-entraîné (MobileNet via TensorFlow.js ou similaire)
•	Identification de la catégorie du produit parmi une liste définie
•	Affichage d'un prix moyen de référence basé sur une base de données interne par ville

Catégories de produits couvertes : eau minérale, jus naturels, sandwich marocain (msemen, harcha), café, thé à la menthe, souvenirs basiques. La liste sera étendue progressivement.

2.2.3. Chatbot d'assistance touristique (optionnel MVP+)
Un assistant conversationnel simple permettra aux touristes de poser des questions courantes en langage naturel. Il sera basé sur un système de règles (FAQ prédéfinies) dans la version MVP, avec une évolution possible vers un modèle de langage léger en version ultérieure. Exemples de questions traitées :
•	"Comment aller de l'aéroport Marrakech-Ménara au centre-ville ?"
•	"Quel est le prix normal d'un petit taxi à Fès ?"
•	"Quels sont les monuments incontournables à Chefchaouen ?"

2.2.4. Simulateur de prix taxi
Cette fonctionnalité estimera le prix d'un trajet en taxi en se basant sur :
•	La distance calculée via l'API de routage d'OpenStreetMap (OSRM)
•	Un prix kilométrique moyen préétabli par ville (mis à jour manuellement)
•	Une majoration selon l'heure (tarif de nuit après 20h)
•	Le type de taxi (petit taxi intra-muros vs grand taxi inter-villes)

Le résultat affiché sera une fourchette de prix (min–max) avec un avertissement rappelant qu'il s'agit d'une estimation et que le compteur doit obligatoirement être utilisé.

2.3. Mode Hors Ligne
Pour garantir une utilité constante, même en l'absence de connexion internet (zones rurales, réseau limité), les données essentielles suivantes seront accessibles hors ligne :
•	Numéros d'urgence (liste complète)
•	Phrases utiles en arabe, darija, français et anglais (dictionnaire de survie)
•	Prix moyens de référence par ville (tarifs taxis, restaurants)
•	Guide anti-arnaques complet
•	Informations de base sur les monuments et monuments principaux déjà consultés











3.3. Budget Estimé
Le budget global estimé du projet est de 15 975 MAD

#	Catégorie / Détail	Détail du calcul	Coût total (MAD)
	👥  RESSOURCES HUMAINES
1	Développeurs Fullstack 	3 développeurs  × 5 sem.	10 000 MAD
	🖥 MATÉRIEL EN LOCATION
4	Ordinateurs portables (3 postes)	150 MAD/sem. × 3 × 5 sem.	2 250 MAD
	☁LOGICIELS, APIS & FONCTIONNEMENT
7	Hébergement backend — Railway Pro	200 MAD 	200 MAD
8	Hébergement frontend — Vercel Pro	200 MAD 	200 MAD
9	Stockage images — Cloudinary Plus	900 MAD 	1 125 MAD
10	API IA traduction	250 MAD 	250 MAD
11	Nom de domaine (.ma ou .com)	Forfait annuel	150 MAD
12	Coworking + internet (3 pers.)	1 800 MAD 	1800 MAD
	TOTAL PROJET PROFESSIONNEL	~15 975 MAD





3.4. Délai de Développement
Le délai estimé total du projet est de 5 semaines, réparti selon le planning suivant :
Phase	Fonctionnalités	Durée estimée
Semaine 1	Setup projet, architecture, modèle de données, maquettes UI	7 jours
Semaine 2	Phase 1 MVP : Auth, géolocalisation, restaurants, monuments, activities	7 jours
Semaine 3	Phase 2 MVP : Transports, simulateur taxi, guide anti-arnaques	7 jours
Semaine 4	Phase 3 MVP : OCR, estimation prix photo, sorties touristiques	7 jours
Semaine 5	Tests, corrections, déploiement, documentation finale	7 jours
 
4. Expérience Utilisateur (UX/UI)
4.1. Principes de Design
•	Mobile-first : L'interface est conçue en priorité pour les petits écrans (smartphones). La version desktop est une extension.
•	Accessibilité : Contrastes suffisants, tailles de polices lisibles, boutons facilement cliquables (taille minimale 44px).
•	Internationalisation : L'interface sera disponible en français, anglais et arabe. Détection automatique de la langue du navigateur.
•	Clarté visuelle : Navigation simple avec barre inférieure (bottom nav) sur mobile. Maximum 5 sections principales.
•	Feedback utilisateur : Indicateurs de chargement, messages d'erreur clairs, confirmation des actions importantes.

4.2. Navigation Principale
La navigation principale sera accessible via une barre de navigation inférieure sur mobile, comprenant 5 onglets :
•	Accueil — Vue d'ensemble de la ville détectée
•	Explorer — Monuments, restaurants, Activités  carte interactive
•	Transport — Guide transports + simulateur taxi
•	Sécurité — Urgences + guide anti-arnaques
•	Communauté — Sorties entre touristes


5. Sécurité
5.1. Authentification et Autorisation
•	Authentification : Système d'inscription/connexion via email + mot de passe (hashé avec bcrypt). 
•	Sessions : Expiration automatique des tokens après inactivité prolongée. Option de déconnexion complète (révocation de tous les tokens).
•	Rôles utilisateurs : Deux niveaux : Utilisateur standard (accès lecture + participation sorties) et Administrateur (gestion du contenu et modération).




6. Roadmap MVP
6.1. Phase 1 — Fondations et Informations Essentielles
Durée estimée : 2 semaines
Objectif : disposer d'une application fonctionnelle avec les informations de base.
•	Authentification des utilisateurs : Inscription, connexion, gestion de profil.
•	Détection de la ville : Géolocalisation automatique + sélection manuelle.
•	Affichage des restaurants : Liste filtrée, détails, carte.
•	Affichage des monuments : Liste avec descriptions, horaires, carte.
•	Numéros d'urgence : Page dédiée avec appel direct, disponible hors ligne.

6.2. Phase 2 — Mobilité et Prévention
Durée estimée : 1 semaine
.Objectif : enrichir l'application avec les outils de transport et de prévention.
•	Guide des transports : Informations taxis, bus, trains ONCF, CTM.
•	Simulateur de prix taxi : Calcul d'estimation basé sur OSRM + tarifs de référence.
•	Guide anti-arnaques : Articles par type d'arnaque + conseils pratiques.

6.3. Phase 3 — Intégration IA et Communauté
Durée estimée : 1 semaine. 
Objectif : finaliser le MVP avec les fonctionnalités IA et communautaires.

•	OCR Panneaux : Prise de photo + extraction texte Tesseract.js + traduction.
•	Estimation prix via photo : Classification TensorFlow.js + affichage prix moyen.
•	Organisation de sorties : Création, consultation et participation à des sorties de groupe.

6.4. Phase 4 — Tests et Déploiement
Durée estimée : 1 semaine. 
Objectif : stabiliser et déployer l'application.
•	Tests fonctionnels : Vérification de toutes les fonctionnalités sur mobile et desktop.
•	Tests de performance : Audit Lighthouse, optimisation des images et des appels API.
•	Déploiement : Mise en production sur Vercel (frontend) et Railway (backend).
•	Documentation : README technique, guide d'utilisation, documentation API.


7. Améliorations Futures 
Au-delà du Produit Minimum Viable, les évolutions suivantes sont envisagées pour les versions futures, en fonction des retours utilisateurs et des ressources disponibles :

•	Reconnaissance de monument via photo : Utilisation d'un modèle de vision pour identifier un monument à partir d'une photo prise par l'utilisateur.

•	Platforme  multi-pays : À terme, la plateforme a vocation à s'étendre au-delà du Maroc pour couvrir d'autres pays
•	Extension linguistique : Ajout de l'espagnol, de l'allemand et du chinois mandarin pour élargir l'audience internationale.
•	Personnalisation du profil : Préférences de voyage, historique de visites, liste de favoris.
•	Système de notation et de commentaires : Permettre aux utilisateurs de noter et de commenter les restaurants et monuments, avec modération.
•	Notifications push : Alertes pour les sorties de groupe, les événements locaux et les alertes de sécurité.
•	Application mobile native : Version React Native (iOS / Android) basée sur l'API existante.
•	Partenariats institutionnels : Intégration de données officielles de l'Office National Marocain du Tourisme (ONMT).
•	Chatbot IA avancé : Migration du système de règles vers un modèle de langage léger .
•	Itinéraires personnalisés : Génération d'itinéraires sur mesure selon les préférences, le budget et la durée du séjour.

