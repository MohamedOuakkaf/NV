# 🚗 Car Rental — Backend API

Backend Node.js + Express + MongoDB pour l'application de location de voitures.

## 🛠 Technologies

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe
- **Multer** pour l'upload d'images

## 📁 Structure

```
backend/
├── config/
│   └── db.js                  # Connexion MongoDB
├── controllers/
│   ├── authController.js      # Inscription / Connexion
│   ├── carController.js       # CRUD voitures
│   ├── reservationController.js # Gestion réservations
│   └── userController.js      # Gestion utilisateurs
├── middleware/
│   ├── authMiddleware.js      # Vérification JWT + rôles
│   └── uploadMiddleware.js    # Upload images (Multer)
├── models/
│   ├── Car.js                 # Modèle voiture
│   ├── Reservation.js         # Modèle réservation
│   └── User.js                # Modèle utilisateur
├── routes/
│   ├── authRoutes.js
│   ├── carRoutes.js
│   ├── reservationRoutes.js
│   └── userRoutes.js
├── scripts/
│   └── seeder.js              # Données initiales
├── uploads/                   # Images uploadées
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## 🚀 Installation

### 1. Prérequis
- Node.js >= 16
- MongoDB installé et démarré

### 2. Cloner et configurer

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env

# Éditer .env avec vos valeurs
nano .env
```

### 3. Fichier `.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/car_rental
JWT_SECRET=votre_secret_ultra_securise
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@carrental.com
ADMIN_PASSWORD=Admin@123456
```

### 4. Initialiser la base de données (optionnel)

```bash
npm run seed
```

Cela crée :
- 1 compte admin (`admin@carrental.com` / `Admin@123456`)
- 1 compte client test (`client@test.com` / `client123`)
- 9 voitures de démonstration

### 5. Démarrer le serveur

```bash
# Production
npm start

# Développement (avec rechargement automatique)
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

## 📡 Endpoints API

### Auth
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/api/auth/register` | Public | Inscription |
| POST | `/api/auth/login` | Public | Connexion |
| GET | `/api/auth/me` | Privé | Mon profil |

### Voitures
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/api/cars` | Public | Liste (+ filtres) |
| GET | `/api/cars/brands` | Public | Marques dispo |
| GET | `/api/cars/:id` | Public | Détail |
| POST | `/api/cars` | Admin | Ajouter |
| PUT | `/api/cars/:id` | Admin | Modifier |
| DELETE | `/api/cars/:id` | Admin | Supprimer |

### Réservations
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/api/reservations` | Client | Créer |
| GET | `/api/reservations/my` | Client | Mes réservations |
| PUT | `/api/reservations/:id/cancel` | Client | Annuler |
| GET | `/api/reservations` | Admin | Toutes |
| GET | `/api/reservations/stats` | Admin | Statistiques |
| PUT | `/api/reservations/:id/status` | Admin | Changer statut |

### Utilisateurs
| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| PUT | `/api/users/profile` | Privé | Modifier profil |
| PUT | `/api/users/change-password` | Privé | Changer mdp |
| GET | `/api/users` | Admin | Tous les users |
| DELETE | `/api/users/:id` | Admin | Supprimer user |

## 🔒 Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <votre_token_jwt>
```

## 🔍 Filtres disponibles sur GET /api/cars

```
?page=1&limit=9
?availability=true
?brand=BMW
?category=SUV
?minPrice=50&maxPrice=200
?search=Tesla
?sort=price_asc | price_desc | newest | oldest
```

## 🔗 Connexion avec le Frontend React

Dans votre frontend Vite, créez un fichier `.env` :

```env
VITE_API_URL=http://localhost:5000/api
```

Puis dans vos appels fetch/axios :

```js
const API = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API;
```
