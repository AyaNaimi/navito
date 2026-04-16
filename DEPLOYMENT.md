# Deployment

## Architecture cible

- `backend/` : deploy sur Laravel Cloud
- base de donnees : MySQL Laravel Cloud attachee a l'environnement du backend
- `frontend/` : deploy sur Vercel

## 1. Backend sur Laravel Cloud

1. Pousse le projet sur GitHub.
2. Dans Laravel Cloud, cree une application depuis le repository.
3. Choisis le dossier racine `backend/` pour l'application Laravel.
4. Attache une base MySQL Laravel Cloud a l'environnement.
5. Configure les variables d'environnement suivantes dans Laravel Cloud:

```env
APP_NAME=Navito
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api-ton-projet.laravel.cloud

APP_LOCALE=fr
APP_FALLBACK_LOCALE=en

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local

SANCTUM_STATEFUL_DOMAINS=ton-frontend.vercel.app

GROQ_API_KEY=ton_secret_groq
GROQ_MODEL=llama-3.2-11b-vision-preview

AI_OCR_API_URL=
AI_OCR_API_KEY=
LIBRETRANSLATE_URL=
```

Notes:

- Laravel Cloud injecte automatiquement les credentials `DB_*` quand la base est attachee.
- Si tu ajoutes un domaine perso sur Vercel, ajoute-le aussi dans `SANCTUM_STATEFUL_DOMAINS`.
- Les fichiers sur Laravel Cloud sont ephemeres. Pour des uploads persistants, il faut plus tard utiliser un stockage objet compatible S3.

## 2. Commandes Laravel Cloud

Build commands conseillees:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan optimize
```

Deploy commands conseillees:

```bash
php artisan migrate --force
php artisan db:seed --force
```

Si tu ne veux pas reseeder a chaque deploy, retire `php artisan db:seed --force` et execute-le seulement une fois depuis l'onglet `Commands`.

## 3. Frontend sur Vercel

1. Importe le meme repository dans Vercel.
2. Pour le projet frontend, mets `frontend/` comme `Root Directory`.
3. Vercel detectera Vite. Garde:

- Build command: `npm run build`
- Output directory: `dist`

4. Ajoute les variables d'environnement Vercel:

```env
VITE_API_BASE_URL=https://api-ton-projet.laravel.cloud/api
VITE_GOOGLE_MAPS_API_KEY=ta_cle_google_si_necessaire
```

Le repo contient deja un fichier pret a ajuster:

- [frontend/.env.production](</c:/wamp64/www/navito final v/frontend (2)/frontend/.env.production>)

Le backend a aussi un modele production Laravel Cloud:

- [backend/.env.cloud.example](</c:/wamp64/www/navito final v/frontend (2)/backend/.env.cloud.example>)

Notes:

- Le fichier `frontend/vercel.json` ajoute un fallback SPA pour que les routes React comme `/dashboard/...` fonctionnent apres refresh.
- Ne mets pas `GROQ_API_KEY`, `AI_OCR_API_KEY` ou d'autres secrets en `VITE_*`. Tout ce qui commence par `VITE_` est expose au navigateur.

## 4. Ordre de deploiement

1. Deploy backend Laravel Cloud
2. Cree et attache la base
3. Lance `php artisan migrate --force`
4. Si necessaire, lance `php artisan db:seed --force`
5. Recupere l'URL publique Laravel Cloud
6. Configure `VITE_API_BASE_URL` sur Vercel avec cette URL
7. Deploy frontend Vercel

## 5. Verifications apres deploy

- `https://api-ton-projet.laravel.cloud/api/health` repond
- le frontend charge sans 404 sur refresh
- login / register fonctionnent
- les pages activities / places / restaurants recuperent bien les donnees
- OCR / translation / estimation prix passent par le backend
