const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// userController.js

exports.getAlluser = async (req, res) => {
                let db;
                try {
                                // Récupérer une connexion à la base de données
                                db = await pool.getConnection();
                                console.log("Lancement de la requête d'affichage");

                                // Exécuter la requête pour récupérer tous les utilisateurs
                                const rows = await db.query('SELECT * FROM user');
                                console.log(rows); // Affichage dans la console des résultats

                                // Retourner les résultats dans la réponse
                                res.status(200).json(rows);
                } catch (err) {
                                console.log(err); // Afficher l'erreur dans la console si elle se produit
                                res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
                } finally {
                                if (db) db.release(); // Libérer la connexion même en cas d'erreur
                }
};

exports.Register = async (req, res) => {
                let conn;
                try {
                                const { nom, prenom, email, password } = req.body;

                                // Vérifications des données
                                if (!nom || !prenom || !email || !password) {
                                                return res.status(400).json({ error: 'Tous les champs sont requis' });
                                }

                                conn = await pool.getConnection();

                                // Vérifier si l'utilisateur existe déjà
                                const result = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
                                if (result.length > 0) {
                                                conn.release();
                                                return res.status(400).json({ error: 'Cet utilisateur existe déjà.' });
                                }

                                // Hacher le mot de passe
                                const hashedPassword = await bcrypt.hash(password, 10);

                                // Enregistrer le nouvel utilisateur
                                const insertUserQuery = 'INSERT INTO user (nom, prenom, email, password) VALUES (?, ?, ?, ?)';
                                const insertUserValues = [nom, prenom, email, hashedPassword];
                                await conn.query(insertUserQuery, insertUserValues);
                                conn.release();

                                // Générer un token JWT
                                const token = jwt.sign({ email }, process.env.API_KEY, { expiresIn: '1h' });

                                // Réponse de succès
                                res.status(200).json({ message: "Inscription réussie" });
                } catch (error) {
                                console.error(error);
                                if (conn) conn.release();
                                res.status(500).json({ error: "Erreur lors de l'inscription" });
                }
};




exports.Login = async (req, res) => {
                let conn;
                try {
                                const { email, password } = req.body;

                                conn = await pool.getConnection();

                                const result = await conn.query('SELECT * FROM user WHERE email = ?', [email]);

                                if (result.length === 0) {
                                                console.log(`Aucun utilisateur trouvé avec l'email: ${email}`);
                                                return res.status(400).json({ error: 'Identifiants incorrects' });
                                }

                                const user = result[0];

                                const isPasswordValid = await bcrypt.compare(password, user.password);
                                if (!isPasswordValid) {
                                                console.log('Mot de passe incorrect pour l\'utilisateur:', email);
                                                return res.status(400).json({ error: 'Identifiants incorrects' });
                                }

                                const token = jwt.sign(
                                                { id_user: user.id_user, email: user.email },
                                                process.env.JWT_SECRET,
                                                { expiresIn: '1h' }
                                );

                                const refreshToken = jwt.sign(
                                                { id_user: user.id_user },
                                                process.env.JWT_SECRET,
                                                { expiresIn: '7d' }
                                );

                                // Réponse
                                res.status(200).json({
                                                message: 'Connexion réussie',
                                                token,
                                                refreshToken,
                                                user: { id_user: user.id_user, nom: user.nom, email: user.email }
                                });



                } catch (error) {
                                console.error('Erreur générale de connexion:', error);
                                res.status(500).json({
                                                error: "Erreur lors de la connexion",
                                                details: process.env.NODE_ENV === 'development' ? error.message : null
                                });
                } finally {
                                if (conn) conn.release();
                }
};
exports.getProfile = async (req, res) => {
                let conn;
                try {
                                conn = await pool.getConnection();
                                // On récupère uniquement les informations d'inscription
                                const query = 'SELECT id_user, nom, prenom, email FROM user WHERE id_user = ?';
                                const results = await conn.query(query, [req.user.id_user]);

                                if (results.length > 0) {
                                                res.status(200).json({
                                                                message: 'Profil récupéré avec succès',
                                                                user: {
                                                                                ...results[0],
                                                                                sport: null,    // On ajoute ces champs avec null pour que le frontend 
                                                                                niveau: null    // sache qu'ils doivent être complétés
                                                                }
                                                });
                                } else {
                                                res.status(404).json({ error: 'Utilisateur non trouvé.' });
                                }
                } catch (error) {
                                console.error('Erreur lors de la récupération du profil:', error);
                                res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
                } finally {
                                if (conn) conn.release();
                }
};





exports.updateProfile = async (req, res) => {
                let conn;
                try {
                                console.log('Requête reçue - req.user:', req.user); // ✅ Vérification

                                if (!req.user || !req.user.id_user) {
                                                return res.status(401).json({ error: 'Utilisateur non authentifié.' });
                                }

                                const { nom, prenom, email, password, sport, niveau } = req.body;
                                const userId = req.user.id_user; // Récupéré du token JWT

                                conn = await pool.getConnection();

                                // Vérifier si l'utilisateur existe
                                const [userCheck] = await conn.query('SELECT * FROM user WHERE id_user = ?', [userId]);
                                if (!userCheck || userCheck.length === 0) {
                                                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
                                }

                                let updateQuery = 'UPDATE user SET ';
                                const updateValues = [];
                                const updateFields = [];

                                if (nom) {
                                                updateFields.push('nom = ?');
                                                updateValues.push(nom);
                                }
                                if (prenom) {
                                                updateFields.push('prenom = ?');
                                                updateValues.push(prenom);
                                }
                                if (email) {
                                                // Vérifier si l'email est déjà utilisé par un autre utilisateur
                                                const [emailCheck] = await conn.query(
                                                                'SELECT id_user FROM user WHERE email = ? AND id_user != ?',
                                                                [email, userId]
                                                );
                                                if (emailCheck.length > 0) {
                                                                return res.status(400).json({ error: 'Cet email est déjà utilisé par un autre utilisateur.' });
                                                }
                                                updateFields.push('email = ?');
                                                updateValues.push(email);
                                }
                                if (sport) {
                                                updateFields.push('sport = ?');
                                                updateValues.push(sport);
                                }
                                if (niveau) {
                                                updateFields.push('niveau = ?');
                                                updateValues.push(niveau);
                                }
                                if (password) {
                                                const hashedPassword = await bcrypt.hash(password, 10);
                                                updateFields.push('password = ?');
                                                updateValues.push(hashedPassword);
                                }

                                // Si aucun champ à mettre à jour
                                if (updateFields.length === 0) {
                                                return res.status(400).json({ error: 'Aucune donnée à mettre à jour.' });
                                }

                                // Compléter la requête SQL
                                updateQuery += updateFields.join(', ');
                                updateQuery += ' WHERE id_user = ?';
                                updateValues.push(userId);

                                // Exécuter la mise à jour
                                await conn.query(updateQuery, updateValues);

                                // Récupérer les informations mises à jour
                                const [updatedUser] = await conn.query(
                                                'SELECT id_user, nom, prenom, email, sport, niveau FROM user WHERE id_user = ?',
                                                [userId]
                                );

                                if (!updatedUser || updatedUser.length === 0) {
                                                return res.status(404).json({ error: 'Utilisateur non trouvé après mise à jour.' });
                                }

                                res.status(200).json({
                                                message: 'Profil mis à jour avec succès',
                                                user: updatedUser[0]
                                });

                } catch (error) {
                                console.error('Erreur lors de la mise à jour du profil:', error);
                                res.status(500).json({
                                                error: 'Erreur lors de la mise à jour du profil',
                                                details: process.env.NODE_ENV === 'development' ? error.message : null
                                });
                } finally {
                                if (conn) conn.release();
                }
};

exports.refreshToken = (req, res) => {
                const { refreshToken } = req.body;

                if (!refreshToken) {
                                return res.status(401).json({ error: 'Refresh token manquant' });
                }

                try {
                                const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
                                const newToken = jwt.sign(
                                                { id_user: decoded.id_user },
                                                process.env.JWT_SECRET,
                                                { expiresIn: '1h' }
                                );

                                res.json({ token: newToken });
                } catch (error) {
                                return res.status(403).json({ error: 'Refresh token invalide ou expiré' });
                }
};

