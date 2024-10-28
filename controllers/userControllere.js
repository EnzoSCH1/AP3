const db = require('./database/database')

exports.getAlluser = async (req, res) => {
                try {
                                console.log("lancement de la requete d'affichage")
                                const rows = await db.pool.query('Select * from user');
                                console.log(rows);
                                res.status(200).json(rows)
                }
                catch (err) {
                                console.log(err);
                }
};

