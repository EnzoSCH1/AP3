const jwt = require('jsonwebtoken');
const pool = require('../database');

async function authenticator(req, res, next) {
                try {
                                const authHeader = req.headers.authorization;
                                console.log("Token reçu dans authenticator:", authHeader);

                                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                                                console.log("❌ Token manquant ou format incorrect");
                                                return res.status(401).json({ error: "Token manquant ou format incorrect" });
                                }

                                const token = authHeader.split(' ')[1];
                                console.log("Token extrait:", token.substring(0, 15) + "...");

                                let decoded;
                                try {
                                                // Utilisation de la variable d'environnement JWT_SECRET
                                                decoded = jwt.verify(token, process.env.JWT_SECRET);
                                                console.log("✅ Token décodé avec succès:", decoded);
                                } catch (err) {
                                                console.error("❌ Erreur lors du décodage du token:", err.message);
                                                return res.status(401).json({ error: "Token invalide ou expiré" });
                                }

                                // Vérifier si l'ID utilisateur est présent dans le token
                                if (!decoded.id_user && !decoded.userId) {
                                                console.error("❌ Erreur: ID utilisateur non trouvé dans le token");
                                                return res.status(401).json({ error: "Format de token incorrect: ID utilisateur manquant" });
                                }

                                // Accepter id_user ou userId (pour compatibilité)
                                const userId = parseInt(decoded.id_user || decoded.userId, 10);
                                console.log("ID utilisateur extrait:", userId, "Type:", typeof userId);

                                if (isNaN(userId)) {
                                                console.error("❌ L'ID utilisateur n'est pas un nombre valide");
                                                return res.status(400).json({ error: "Format d'ID utilisateur invalide" });
                                }

                                const conn = await pool.getConnection();
                                try {
                                                // Vérification en base de données avec plus de détails dans les logs
                                                console.log("Recherche de l'utilisateur avec ID:", userId);
                                                const [rows] = await conn.query(
                                                                "SELECT id_user, email, nom, prenom FROM user WHERE id_user = ?",
                                                                [userId]
                                                );

                                                if (!rows.length) {
                                                                console.error(`❌ Utilisateur avec ID ${userId} non trouvé en base de données`);
                                                                return res.status(404).json({ error: "Utilisateur non trouvé" });
                                                }

                                                console.log("✅ Utilisateur authentifié avec succès:", rows[0]);
                                                req.user = rows[0];
                                                next();
                                } catch (dbError) {
                                                console.error("❌ Erreur MySQL:", dbError);
                                                return res.status(500).json({ error: "Erreur interne du serveur (base de données)" });
                                } finally {
                                                conn.release();
                                }
                } catch (err) {
                                console.error("❌ Erreur globale authenticator:", err);
                                return res.status(500).json({ error: "Erreur interne du serveur" });
                }
}

module.exports = { authenticator };