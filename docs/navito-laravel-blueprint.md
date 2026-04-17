# Navito Laravel Blueprint

## Vision produit

Navito doit commencer avec un flux simple et rassurant:

1. L'utilisateur choisit sa langue.
2. Il choisit `Connexion`, `Creer un compte`, ou `Continuer en invite`.
3. S'il est touriste, il peut soit choisir `Pays > Ville`, soit autoriser la geolocalisation si le touriste est deja sur place.
4. S'il est `guide`, `driver` ou `super_admin`, il est redirige vers son dashboard apres authentification.
5. Les dashboards restent interdits aux invites.

## Roles

- `tourist`: acces au contenu public, reservations, favoris, demandes de guide, sorties communautaires.
- `guide`: dashboard guide, gestion du profil, disponibilites, demandes et messages.
- `driver`: dashboard chauffeur, verification, courses, profil, disponibilites.
- `super_admin`: dashboard global, moderation, statistiques, gestion CRUD.

## Flux recommande

### Touriste connecte

`/language -> /welcome -> /login|/register -> /country -> /city -> /home`

### Touriste invite

`/language -> /welcome -> continuer en invite -> /country -> /city ou geolocalisation -> /home`

### Guide

`/language -> /welcome -> /login|/register -> /dashboard/guide`

### Chauffeur

`/language -> /welcome -> /login|/register -> /driver/join -> /driver/verify -> /driver/pending -> /dashboard/driver`

### Super admin

`/language -> /welcome -> /login|/register -> /dashboard/superadmin`

## Backend Laravel

### Stack

- Laravel 12
- Laravel Breeze ou Sanctum pour l'auth API
- MySQL avec base `navito`
- Policies + middleware de role
- Form Requests pour validation CRUD
- Resources API pour serialisation

### Tables principales

- `users`
- `roles`
- `user_roles`
- `tourist_profiles`
- `guide_profiles`
- `driver_profiles`
- `countries`
- `cities`
- `places`
- `activities`
- `restaurants`
- `transport_fares`
- `scam_reports`
- `emergency_contacts`
- `guide_requests`
- `community_events`
- `community_event_participants`
- `favorites`

### Middleware

- `auth:sanctum`
- `role:super_admin`
- `role:guide`
- `role:driver`
- `role:tourist`

### Dashboards

- `GET /api/me/dashboard`
- Si role = `super_admin` -> stats, users, moderation, CRUD contenu
- Si role = `guide` -> demandes, planning, messages
- Si role = `driver` -> verification, courses, revenus
- Si role = `tourist` -> reservations, favoris, demandes envoyees

### CRUD minimum qui doit marcher

- `users`
- `countries`
- `cities`
- `places`
- `activities`
- `restaurants`
- `transport_fares`
- `emergency_contacts`
- `community_events`
- `guide_requests`

## Routes API suggerees

```php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [ProfileController::class, 'me']);
    Route::get('/me/dashboard', [DashboardController::class, 'show']);

    Route::apiResource('countries', CountryController::class);
    Route::apiResource('cities', CityController::class);
    Route::apiResource('places', PlaceController::class);
    Route::apiResource('activities', ActivityController::class);
    Route::apiResource('restaurants', RestaurantController::class);
    Route::apiResource('community-events', CommunityEventController::class);
    Route::apiResource('guide-requests', GuideRequestController::class);
});
```

## Detection si le touriste est deja dans le pays

Au premier acces au contenu:

1. Le frontend demande la geolocalisation.
2. Si la permission est acceptee, il envoie `lat/lng` a Laravel.
3. Le backend fait un reverse geocoding ou match avec les villes supportees.
4. L'app charge les recommandations de la ville detectee.
5. Si la permission est refusee, l'utilisateur choisit manuellement `pays` puis `ville`.

## Regles UX importantes

- Le visiteur ne voit jamais un dashboard sans etre connecte.
- Le choix invite reste simple et visible.
- Le role doit etre choisi des la connexion ou l'inscription.
- Les pages protegees redirigent vers `login` avec `redirectTo`.
- Les recommandations privilegient la position actuelle si elle existe.

## Structure Laravel conseillee

```text
app/Http/Controllers/Api
app/Http/Middleware/EnsureUserHasRole.php
app/Models
app/Policies
database/migrations
database/seeders
routes/api.php
```

## Seed initial conseille

- Roles: `tourist`, `guide`, `driver`, `super_admin`
- Pays initial: `Morocco`
- Villes initiales: `Marrakech`, `Fes`, `Casablanca`, `Tangier`, `Agadir`, `Rabat`
- Un super admin de test
- Quelques restaurants, activites et lieux par ville
