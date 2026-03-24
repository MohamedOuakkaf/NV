const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// ─── Middlewares ────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir les images uploadées statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/users',        require('./routes/userRoutes'));
app.use('/api/cars',         require('./routes/carRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'Car Rental API is running 🚗' });
});

// ─── Gestionnaire d'erreurs global ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
