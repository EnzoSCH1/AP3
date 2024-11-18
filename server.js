const mariadb = require('mariadb');
const express = require('express');
const app = express();
const cors = require("cors")
require('dotenv').config();
let userRoute = require('./Routes/userRoute')
app.use(express.json())

const pool = mariadb.createPool({
                host: process.env.DB_HOST,
                database: process.env.DB_USER,
                user: process.env.DB_PWD,
                password: process.env.DB_DTB,
});
app.use('/user', userRoute)


app.listen(3000, () => {
                console.log("Server à l'écoute");
});





