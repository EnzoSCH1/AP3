const jwt = require('jsonwebtoken');
const pool = require('../database');
const dotenv = require('dotenv');
dotenv.config();

// Middleware pour vérifier le token JWT et l'utilisateur
async function authentificator(req, res, next) {
                const token = req.headers['authorization']?.split(' ')[1];  // Récupérer le token depuis l'en-tête

                if (!token) {
                                return res.status(401).json({ error: 'Token manquant' });
                }

                try {
                                // Décoder le token
                                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                                // Rechercher l'utilisateur dans la base de données en fonction de l'email du token
                                const result = await pool.query('SELECT * FROM user WHERE email = ?', [decoded.email]);

                                if (result.length === 0) {
                                                return res.status(404).json({ error: 'Utilisateur non trouvé' });
                                }

                                // Ajouter l'utilisateur à la requête
                                req.user = result[0];

                                // Passer à la prochaine fonction du middleware
                                next();
                } catch (err) {
                                console.error('Erreur lors de la vérification du token:', err);
                                res.status(401).json({ error: 'Token invalide ou expiré' });
                }
}

module.exports = { authentificator };
