const jwt = require('jsonwebtoken');
const { pool } = require('../database'); // Assurez-vous du bon chemin d'import
const dotenv = require('dotenv');
dotenv.config();

async function authenticator(req, res, next) {
                const token = req.headers['authorization']?.split(' ')[1];

                if (!token) {
                                return res.status(401).json({ error: 'Token manquant' });
                }

                try {
                                // Vérifier et décoder le token
                                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                                // Utiliser une connexion du pool pour la requête
                                const connection = await pool.getConnection();

                                try {
                                                // Récupérer l'utilisateur
                                                const [result] = await connection.query('SELECT * FROM users WHERE email = ?', [decoded.email]);

                                                if (result.length === 0) {
                                                                return res.status(404).json({ error: 'Utilisateur non trouvé' });
                                                }

                                                // Ajouter l'utilisateur à la requête
                                                req.user = result[0];

                                                // Passer à la prochaine fonction du middleware
                                                next();
                                } finally {
                                                // Toujours libérer la connexion
                                                connection.release();
                                }
                } catch (err) {
                                console.error('Erreur lors de la vérification du token:', err);

                                // Gérer différents types d'erreurs JWT
                                if (err.name === 'TokenExpiredError') {
                                                return res.status(401).json({ error: 'Token expiré' });
                                }

                                res.status(401).json({ error: 'Token invalide' });
                }
}

module.exports = { authenticator };