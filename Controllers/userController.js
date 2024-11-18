const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAlluser = async (req, res) => {
                try {
                                const db = await pool.getConnection()
                                console.log("lancement de la requete d'affichage")
                                const rows = await db.query('Select * from users');
                                console.log(rows);
                                res.status(200).json(rows)
                }
                catch (err) {
                                console.log(err);
                }
};


exports.Register = async (req, res) => {
                let conn;
                try {
                                const { email, password } = req.body;
                                conn = await pool.getConnection();

                                // Vérifier si l'utilisateur existe déjà dans la base de données
                                const result = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
                                if (result.length > 0) {
                                                conn.release();
                                                return res.status(400).json({ error: 'Cet utilisateur existe déjà.' });
                                }

                                // Hacher le mot de passe avec bcrypt
                                const hashedPassword = await bcrypt.hash(password, 10);

                                // Enregistrer le nouvel utilisateur dans la base de données
                                const insertUserQuery = 'INSERT INTO user (email, password) VALUES (?, ?)';
                                const insertUserValues = [email, hashedPassword];
                                await conn.query(insertUserQuery, insertUserValues);
                                conn.release();

                                // Générer un token JWT pour l'utilisateur nouvellement inscrit
                                const token = jwt.sign({ email }, process.env.API_KEY, { expiresIn: '1h' });

                                // Envoyer le token en réponse
                                res.json({ token });

                } catch (error) {
                                console.error(error);
                                if (conn) conn.release(); // Assure la libération de la connexion en cas d'erreur
                                res.status(500).json({ error: "Erreur lors de l'inscription" });
                }
};


exports.Login = async (req, res) => {
                let conn;
                try {
                                const { email, password } = req.body;
                                conn = await pool.getConnection();

                                // Vérifier si l'utilisateur existe
                                const result = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
                                conn.release();

                                if (result.length === 0) {
                                                return res.status(400).json({ error: 'Utilisateur non trouvé.' });
                                }

                                const user = result[0];

                                // Vérifier si le mot de passe correspond
                                const comparePassword = await bcrypt.compare(password, user.password);
                                if (!comparePassword) {
                                                return res.status(400).json({ error: 'Mot de passe incorrect.' });
                                }

                                // Générer un token JWT pour l'utilisateur
                                const token = jwt.sign({ email: user.email }, process.env.API_KEY, { expiresIn: '1h' });

                                // Envoyer le token en réponse
                                res.json({ token });


                } catch (error) {
                                console.error(error);
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

// Fonction pour mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
                try {
                                const userId = req.user.id; // On suppose que `req.user` contient l'ID de l'utilisateur connecté (généralement défini par le middleware d'authentification)
                                const { nom, prenom, email, sport, niveau, password } = req.body;

                                // Vérifier si l'utilisateur existe
                                const user = await User.findById(userId);
                                if (!user) {
                                                return res.status(404).json({ message: "Utilisateur non trouvé" });
                                }

                                // Mettre à jour les informations
                                if (nom) user.nom = nom;
                                if (prenom) user.prenom = prenom;
                                if (email) user.email = email;
                                if (sport) user.sport = sport;
                                if (niveau) user.niveau = niveau;

                                // Si un nouveau mot de passe est fourni, le hacher avant de le sauvegarder
                                if (password) {
                                                const salt = await bcrypt.genSalt(10);
                                                user.password = await bcrypt.hash(password, salt);
                                }

                                // Sauvegarder les modifications
                                await user.save();

                                res.status(200).json({ message: "Profil mis à jour avec succès" });
                } catch (error) {
                                console.error("Erreur lors de la mise à jour du profil:", error);
                                res.status(500).json({ message: "Erreur serveur" });
                }
};



