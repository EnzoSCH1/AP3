// database.js
const mariadb = require('mariadb');

const pool = mariadb.createPool({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'm2l',

});

module.exports = pool; 
