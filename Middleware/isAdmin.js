const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
                console.log('🔍 Vérification admin pour:', req.user);

                // Vérifier que l'utilisateur est bien authentifié
                if (!req.user) {
                                console.log('❌ Aucun utilisateur dans req.user');
                                return res.status(401).json({ error: 'Utilisateur non authentifié' });
                }

                // Vérifier le statut admin (plusieurs formats possibles)
                const isAdminUser = req.user.is_admin === 1 ||
                                req.user.is_admin === true ||
                                req.user.is_admin === '1';

                if (!isAdminUser) {
                                console.log('❌ Utilisateur non admin:', req.user.is_admin);
                                return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
                }

                console.log('✅ Utilisateur admin vérifié');
                next();
};

module.exports = isAdmin;