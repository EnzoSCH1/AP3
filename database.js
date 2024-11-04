const mariadb = require('mariadb');

const pool = mariadb.createPool({
                host: 'localhost',
                database: 'm2l',
                user: 'root',
                password: '',
});

module.exports = pool;