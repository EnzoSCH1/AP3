const pool = require('../database');

exports.isAdmin = async (req, res, next) => {
                let conn;
                try {
                                // Vérifie si l'utilisateur est bien défini et si l'email est disponible
                                if (!req.user || !req.user.email) {
                                                return res.status(403).json({ error: 'Accès interdit - Aucune donnée utilisateur trouvée' });
                                }

                                // Récupère une connexion à partir du pool
                                conn = await pool.getConnection();  // On récupère une connexion à partir du pool

                                // Recherche de l'utilisateur dans la base de données pour vérifier ses droits
                                const result = await conn.query('SELECT is_admin FROM user WHERE email = ?', [req.user.email]);

                                // Si l'utilisateur existe et possède les droits admin
                                if (result.length > 0 && result[0].is_admin === 1) {
                                                return next(); // L'utilisateur est administrateur, donc on passe au prochain middleware ou à la route
                                } else {
                                                return res.status(403).json({ error: 'Accès interdit - Droits administrateur requis' });
                                }
                } catch (error) {
                                console.error('Erreur dans le middleware isAdmin:', error);
                                res.status(500).json({ error: 'Erreur interne du serveur' });
                } finally {
                                if (conn) conn.release();  // Libère la connexion à la fin, si elle a été obtenue
                }
};
