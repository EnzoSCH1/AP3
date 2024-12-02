const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoute = require('./Routes/userRoute');
const reservationRoutes = require('./Routes/reservationRoute');
const invoiceRoute = require('./Routes/invoiceRoute');


dotenv.config();

const app = express(); // Déclaration de l'instance 'app' avant de l'utiliser

// Middleware
const corsOptions = {
                origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Autoriser les deux origines
                methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
                credentials: true // Si vous utilisez des cookies ou des sessions
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/user', userRoute); // Route pour les utilisateurs, comme /user/register
app.use('/reservations', reservationRoutes); // Route pour les réservations, comme /reservations
app.use('/invoices', invoiceRoute);


// Lancer le serveur
app.listen(3000, () => {
                console.log('Server à l\'écoute sur le port 3000');
});
