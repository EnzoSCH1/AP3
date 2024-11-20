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

                                // Vérification des données d'entrée
                                if (!email || !password) {
                                                return res.status(400).json({ error: 'Email et mot de passe requis' });
                                }

                                conn = await pool.getConnection();
                                console.log("Connexion réussie");

                                // Vérifier si l'utilisateur existe
                                const result = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
                                console.log("Résultat de la requête:", result);

                                conn.release();

                                if (result.length === 0) {
                                                return res.status(400).json({ error: 'Utilisateur non trouvé.' });
                                }

                                const user = result[0]; // Utilisateur trouvé dans la base de données
                                console.log("Utilisateur trouvé:", user);

                                // Comparer les mots de passe
                                const isPasswordValid = await bcrypt.compare(password, user.password);
                                if (!isPasswordValid) {
                                                return res.status(400).json({ error: 'Mot de passe incorrect.' });
                                }

                                // Générer un token JWT
                                const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

                                res.json({ token, message: 'Connexion réussie' });
                } catch (error) {
                                console.error('Erreur de connexion:', error);
                                if (conn) conn.release();
                                res.status(500).json({ error: "Erreur lors de la connexion" });
                }
};




exports.getProfile = async (req, res) => {
                try {
                                const conn = await pool.getConnection();
                                const query = 'SELECT username, email FROM user WHERE email = ?';
                                const results = await conn.query(query, [req.user.email]);
                                conn.release();

                                if (results.length > 0) {
                                                res.status(200).json(results[0]);
                                } else {
                                                res.status(404).json({ error: 'Utilisateur non trouvé.' });
                                }
                } catch (error) {
                                console.error(error);
                                res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
                }
};

