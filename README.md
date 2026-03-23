# 🚗 LUXCAR — Application de Location de Voitures

Projet complet avec **Frontend React + Vite** et **Backend Node.js + Express + MongoDB**.

## 📁 Structure du Projet

```
luxcar/
├── frontend/          ← Application React + Vite + Tailwind
└── backend/           ← API REST Node.js + Express + MongoDB
```

---

## 🚀 Démarrage Rapide

### 1. Lancer le Backend

```bash
cd backend
npm install
cp .env.example .env
# Modifier .env avec votre MONGO_URI
npm run seed        # Optionnel : données de démonstration
npm run dev         # Démarre sur http://localhost:5000
```

### 2. Lancer le Frontend

```bash
cd frontend
npm install
npm run dev         # Démarre sur http://localhost:5173
```

---

## 🔑 Comptes de Test (après npm run seed)

| Rôle   | Email                   | Mot de passe  |
|--------|-------------------------|---------------|
| Admin  | admin@carrental.com     | Admin@123456  |
| Client | client@test.com         | client123     |

---

## 🌐 URLs

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000/api
