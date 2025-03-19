const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoute = require('./Routes/userRoute');
const reservationRoutes = require('./Routes/reservationRoute');
const paymentRoute = require('./Routes/paymentRoute');

dotenv.config();

const app = express();

// Middleware CORS
const corsOptions = {
                origin: ['http://127.0.0.1:5501', 'http://localhost:5500'],
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/user', userRoute);


app.use('/reservations', reservationRoutes);


app.use('/payment', paymentRoute);


// ✅ Vérification des routes enregistrées dans Express
// console.log("🚀 Liste des routes disponibles dans Express :");
// app._router.stack.forEach((middleware) => {
//                 if (middleware.route) {
//                                 console.log(`✅ ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
//                 } else if (middleware.name === 'router') {
//                                 middleware.handle.stack.forEach((handler) => {
//                                                 if (handler.route) {
//                                                                 console.log(`✅ ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
//                                                 }
//                                 });
//                 }
// });

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
