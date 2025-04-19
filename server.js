const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoute = require('./Routes/userRoute');
const reservationRoutes = require('./Routes/reservationRoute');
const spacesRoutes = require('./Routes/spaceRoute');

dotenv.config();

const app = express();

// Middleware CORS
const corsOptions = {
                origin: ['http://127.0.0.1:5501', 'http://localhost:5500', 'http://127.0.0.1:5500'],
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware de logging des requêtes
app.use((req, res, next) => {
                console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
                next();
});

// Routes
app.use('/user', userRoute);
app.use('/reservations', reservationRoutes);
app.use('/spaces', spacesRoutes);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
                res.json({ message: 'API M2L fonctionnelle' });
});

// Middleware de gestion d'erreur 404
app.use((req, res, next) => {
                res.status(404).json({ message: "Cette ressource n'existe pas" });
});

// Middleware de gestion globale des erreurs
app.use((err, req, res, next) => {
                console.error("❌ ERREUR SERVEUR :", err);
                res.status(500).json({
                                message: "Une erreur interne est survenue",
                                error: process.env.NODE_ENV === 'production' ? null : err.message
                });
});

// Gestion des erreurs critiques
process.on('uncaughtException', (err) => {
                console.error("🔥 ERREUR CRITIQUE :", err);
});

process.on('unhandledRejection', (reason, promise) => {
                console.error("🔥 PROMESSE NON GÉRÉE :", reason);
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
                console.log(`✅ Serveur à l'écoute sur le port ${PORT}`);
});

module.exports = app;