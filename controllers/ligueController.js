const db = require('./database/database')

exports.getAllligue = async (req, res) => {
                try {
                                console.log("lancement de la requete d'affichage")
                                const rows = await db.pool.query('Select * from ligue');
                                console.log(rows);
                                res.status(200).json(rows)
                }
                catch (err) {
                                console.log(err);
                }
};

