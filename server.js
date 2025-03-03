const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoute = require('./Routes/userRoute');
const reservationRoute = require('./Routes/reservationRoute');




dotenv.config();

const app = express(); // Déclaration de l'instance 'app' avant de l'utiliser

// Middleware
const corsOptions = {
                origin: ['http://127.0.0.1:5501', 'http://localhost:5500'], // Autoriser ces origines
                methods: ['GET', 'POST', 'PUT', 'DELETE'], // Autoriser ces méthodes
                credentials: true // Autoriser l'envoi de cookies/sessions
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/user', userRoute);
app.use('/reservations', reservationRoute);




// Lancer le serveur
app.listen(3000, () => {
                console.log('Server à l\'écoute sur le port 3000');
});
