const db = require('../database');

exports.getSpaceById = async (req, res) => {
                const spaceId = req.params.id;

                try {
                                const conn = await db.getConnection();
                                const [result] = await conn.query('SELECT * FROM spaces WHERE id = ?', [spaceId]);
                                conn.end();

                                if (!result || result.length === 0) {
                                                return res.status(404).json({ message: 'Espace non trouvé' });
                                }

                                res.json(result[0]);
                } catch (err) {
                                console.error(err);
                                res.status(500).json({ message: 'Erreur serveur lors de la récupération du lieu' });
                }
};
