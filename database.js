const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'm2l',
                connectionLimit: 5
});

// Log de débogage
console.log('Configuration de connexion :', {
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                database: process.env.DB_NAME || 'm2l'
});

module.exports = pool;