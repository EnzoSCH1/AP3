require('dotenv').config();
const jwt = require('jsonwebtoken');

// Vérifier si la clé secrète est bien chargée
if (!process.env.JWT_SECRET) {
                console.error("❌ Erreur : La clé JWT_SECRET est introuvable !");
                process.exit(1);
}

// 🔐 Données de l'utilisateur (à remplacer par des vraies données)
const userData = {
                id_user: 11, // ID utilisateur réel
                email: 'user@example.com', // Email réel
                role: 'user' // Exemple : admin, user, etc.
};

// Génération d'un token sécurisé avec expiration de 7 jours
const token = jwt.sign(
                userData,
                process.env.JWT_SECRET,
                { expiresIn: '7d', algorithm: 'HS256' }
);

console.log('✅ Nouveau token JWT :', token);
