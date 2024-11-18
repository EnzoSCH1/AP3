const jwt = require('jsonwebtoken');

// Vérifier si l'utilisateur est bien authentifié
exports.authentificator = (req, res, next) => {

                // Récupérer le token soit des query params soit du header Authorization sans préfixe 'Bearer'
                const token = req.query.token || req.headers.authorization;

                // Vérifier que le token est présent et que la clé API est définie
                if (token && process.env.API_KEY) {
                                jwt.verify(token, process.env.API_KEY, (err, decoded) => {
                                                if (err) {
                                                                // Le token est invalide
                                                                return res.status(401).json({ error: 'Access denied - Invalid token' });
                                                }

                                                // Le token est valide, stocker les données décodées dans la requête
                                                req.user = decoded;
                                                next(); // Passer au middleware ou à la route suivante
                                });
                } else {
                                // Le token est absent ou la clé API n'est pas définie
                                res.status(401).json({ error: 'Access denied - No token provided' });
                }
};
