const mariadb = require('mariadb');

const pool = mariadb.createPool({
                host: process.env.DB_HOST,
                database: process.env.DB_USER,
                user: process.env.DB_PWD,
                password: process.env.DB_DTB,
});

module.exports = pool;