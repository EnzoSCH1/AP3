const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const userRoute = require('./Routes/userRoute');
const reservationRoutes = require('./Routes/reservationRoute');
const spacesRoutes = require('./Routes/spaceRoute');
const articleRoutes = require('./Routes/articleRoutes');

dotenv.config();

const app = express();

// CORS
const corsOptions = {
                origin: ['http://127.0.0.1:5501', 'http://localhost:5500', 'http://127.0.0.1:5500'],
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Logging
app.use((req, res, next) => {
                console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
                next();
});

// Fichiers statiques
app.use(express.static(path.join(__dirname)));

// Routes API
app.use('/user', userRoute);
app.use('/reservations', reservationRoutes);
app.use('/spaces', spacesRoutes);
app.use('/articles', articleRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de test
app.get('/', (req, res) => {
                res.json({ message: 'API M2L fonctionnelle' });
});

// 404
app.use((req, res) => {
                res.status(404).json({ message: "Cette ressource n'existe pas" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
                console.error("ERREUR SERVEUR :", err);
                res.status(500).json({
                                message: "Une erreur interne est survenue",
                                error: process.env.NODE_ENV === 'production' ? null : err.message
                });
});

// Exceptions non gérées
process.on('uncaughtException', (err) => {
                console.error("ERREUR CRITIQUE :", err);
});

process.on('unhandledRejection', (reason) => {
                console.error("PROMESSE NON GÉRÉE :", reason);
});

// Lancement du serveur (corrigé ici)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
                console.log(`Serveur à l'écoute sur le port ${PORT}`);
});

module.exports = app;
