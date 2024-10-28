const pool = require('../database/database');





















































exports.getAllligue = async (req, res) => {
                let conn = await pool.getConnection()
                try {
                                console.log("lancement de la requete d'affichage")
                                const rows = await conn.query('Select * from ligue');
                                console.log(rows);
                                res.status(200).json(rows)
                }
                catch (err) {
                                console.log(err);
                }
};

