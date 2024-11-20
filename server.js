// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoute = require('./Routes/userRoute');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', userRoute);

// Lancer le serveur
app.listen(3000, () => {
                console.log('Server à l\'écoute sur le port 3000');
});