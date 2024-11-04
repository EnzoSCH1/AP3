const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// exports.getAlluser = async (req, res) => {
//                 try {
//                                 const db = await pool.getConnection()
//                                 console.log("lancement de la requete d'affichage")
//                                 const rows = await db.query('Select * from users');
//                                 console.log(rows);
//                                 res.status(200).json(rows)
//                 }
//                 catch (err) {
//                                 console.log(err);
//                 }
// };


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
