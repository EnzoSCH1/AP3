const jwt = require('jsonwebtoken');
const pool = require('../database');

async function authenticator(req, res, next) {
                try {
                                const authHeader = req.headers.authorization;

                                // Vérifier si le header Authorization est bien présent
                                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                                                console.error('❌ Token manquant ou mal formaté.');
                                                return res.status(401).json({ error: 'Token manquant ou invalide' });
                                }

                                const token = authHeader.split(' ')[1]; // Récupération du token après "Bearer "
                                console.log('✅ Token reçu:', token);

                                // Vérifier et décoder le token
                                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                                console.log('✅ Token décodé:', decoded);

                                if (!decoded || !decoded.id_user) {
                                                console.error('❌ Token invalide.');
                                                return res.status(401).json({ error: 'Token invalide' });
                                }

                                // Connexion à la base de données
                                const conn = await pool.getConnection();
                                try {
                                                console.log(`🔍 Vérification de l'utilisateur ID: ${decoded.id_user}`);

                                                // Vérifier si l'utilisateur existe
                                                const [rows] = await conn.query('SELECT * FROM user WHERE id_user = ?', [decoded.id_user]);
                                                conn.release(); // Libérer la connexion après la requête

                                                console.log('✅ Résultat de la requête:', rows);

                                                if (!rows || rows.length === 0) {
                                                                console.error('❌ Utilisateur non trouvé.');
                                                                return res.status(404).json({ error: 'Utilisateur non trouvé' });
                                                }

                                                // Stocker l'utilisateur dans `req.user` pour l'utiliser dans les routes suivantes
                                                req.user = rows[0];
                                                console.log('✅ Utilisateur authentifié:', req.user);

                                                next(); // Passer à la prochaine fonction middleware ou route
                                } catch (err) {
                                                console.error('❌ Erreur lors de la requête SQL:', err);
                                                return res.status(500).json({ error: 'Erreur interne du serveur' });
                                }
                } catch (err) {
                                console.error('❌ Erreur lors de la vérification du token:', err);

                                if (err.name === 'TokenExpiredError') {
                                                console.warn('🔄 Token expiré, tentative de rafraîchissement...');
                                                return res.status(401).json({ error: 'Token expiré', refresh: true });
                                }


                                return res.status(401).json({ error: 'Token invalide' });
                }
}

module.exports = { authenticator };
