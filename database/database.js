
const m2l = require('m2l');
const express = require('express');
const app = express();
app.use(express.json())

const pool = mariadb.createPool({
                host: 'localhost',
                database: 'm2l',
                user: 'root',
                password: '',
});

module.express = { pool: pool };