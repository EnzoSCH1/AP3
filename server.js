const mariadb = require('mariadb');
const express = require('express');
const app = express();
require('dotenv').config();
let userRoute = require('./Routes/userRoute')
app.use(express.json())

const pool = mariadb.createPool({
                host: 'localhost',
                database: 'test',
                user: 'root',
                password: '',
});
app.use('/user', userRoute)


app.listen(3000, () => {
                console.log("Server à l'écoute");
});





