exports.isAdmin = async (req, res, next) => {
                let conn;
                try {
                                if (!req.user || !req.user.id_user) {
                                                console.log("❌ Accès refusé - Aucune donnée utilisateur trouvée");
                                                return res.status(403).json({ error: 'Accès interdit - Aucune donnée utilisateur trouvée' });
                                }

                                console.log('🔍 Vérification des droits admin pour l\'ID utilisateur:', req.user.id_user);

                                conn = await pool.getConnection();
                                const [result] = await conn.query('SELECT is_admin FROM user WHERE id_user = ?', [req.user.id_user]);

                                console.log('📊 Résultat de la requête isAdmin:', result);

                                if (result.length > 0 && result[0].is_admin === 1) {
                                                console.log("✅ Accès administrateur autorisé");
                                                return next();
                                } else {
                                                console.log("❌ Accès interdit - L'utilisateur n'est pas admin");
                                                return res.status(403).json({ error: 'Accès interdit - Droits administrateur requis' });
                                }
                } catch (error) {
                                console.error('❌ Erreur dans le middleware isAdmin:', error);
                                res.status(500).json({ error: 'Erreur interne du serveur' });
                } finally {
                                if (conn) conn.release();
                }
};
