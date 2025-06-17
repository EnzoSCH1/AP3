const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//  GET ALL USERS
exports.getAlluser = async (req, res) => {
                let conn;
                try {
                                conn = await pool.getConnection();
                                const [rows] = await conn.query('SELECT * FROM user');
                                res.status(200).json(rows);
                } catch (err) {
                                console.error(err);
                                res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
                } finally {
                                if (conn) conn.release();
                }
};

// INSCRIPTION
exports.Register = async (req, res) => {
                let conn;
                try {
                                const { nom, prenom, email, password } = req.body;

                                if (!nom || !prenom || !email || !password) {
                                                return res.status(400).json({ error: 'Tous les champs sont requis' });
                                }

                                conn = await pool.getConnection();

                                const [existing] = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
                                if (existing.length > 0) {
                                                return res.status(400).json({ error: 'Cet utilisateur existe déjà.' });
                                }

                                const hashedPassword = await bcrypt.hash(password, 10);

                                const insertQuery = 'INSERT INTO user (nom, prenom, email, password) VALUES (?, ?, ?, ?)';
                                await conn.query(insertQuery, [nom, prenom, email, hashedPassword]);

                                res.status(200).json({ message: "Inscription réussie" });
                } catch (error) {
                                console.error(error);
                                res.status(500).json({ error: "Erreur lors de l'inscription" });
                } finally {
                                if (conn) conn.release();
                }
};

//  CONNEXION
exports.Login = async (req, res) => {
                let conn;
                try {
                                const { email, password } = req.body;
                                conn = await pool.getConnection();

                                const [result] = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
                                if (result.length === 0) {
                                                return res.status(400).json({ error: 'Identifiants incorrects' });
                                }

                                const user = result[0];
                                if (!user.password || typeof user.password !== 'string') {
                                                return res.status(500).json({ error: 'Mot de passe invalide pour cet utilisateur.' });
                                }

                                const isPasswordValid = await bcrypt.compare(password, user.password);
                                if (!isPasswordValid) {
                                                return res.status(400).json({ error: 'Identifiants incorrects' });
                                }

                                const secret = process.env.JWT_SECRET;
                                const token = jwt.sign({ id_user: user.id_user, email: user.email }, secret, { expiresIn: '1h' });
                                const refreshToken = jwt.sign({ id_user: user.id_user }, secret, { expiresIn: '7d' });

                                res.status(200).json({
                                                message: 'Connexion réussie',
                                                token,
                                                refreshToken,
                                                user: {
                                                                id_user: user.id_user,
                                                                nom: user.nom,
                                                                prenom: user.prenom,
                                                                email: user.email,
                                                                sport: user.sport,
                                                                niveau: user.niveau
                                                }
                                });
                } catch (error) {
                                console.error('Erreur générale de connexion:', error);
                                res.status(500).json({ error: "Erreur serveur" });
                } finally {
                                if (conn) conn.release();
                }
};

//  PROFIL
exports.getProfile = async (req, res) => {
                let conn;
                try {
                                conn = await pool.getConnection();
                                const [results] = await conn.query(
                                                'SELECT id_user, nom, prenom, email, sport, niveau, is_admin, admin_request FROM user WHERE id_user = ?',
                                                [req.user.id_user]
                                );

                                if (results.length === 0) {
                                                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
                                }

                                res.status(200).json({ message: 'Profil récupéré', user: results[0] });
                } catch (error) {
                                console.error('Erreur getProfile:', error);
                                res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
                } finally {
                                if (conn) conn.release();
                }
};

// COMPLÉTER LE PROFIL
exports.complementProfile = async (req, res) => {
                let conn;
                try {
                                const { sport, niveau } = req.body;
                                const userId = req.user.id_user;

                                conn = await pool.getConnection();

                                const [userCheck] = await conn.query('SELECT * FROM user WHERE id_user = ?', [userId]);
                                if (!userCheck || userCheck.length === 0) {
                                                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
                                }

                                if (!sport && !niveau) {
                                                return res.status(400).json({ error: 'Aucun champ fourni.' });
                                }

                                const fields = [];
                                const values = [];

                                if (sport) {
                                                fields.push('sport = ?');
                                                values.push(sport);
                                }
                                if (niveau) {
                                                fields.push('niveau = ?');
                                                values.push(niveau);
                                }

                                const updateQuery = `UPDATE user SET ${fields.join(', ')} WHERE id_user = ?`;
                                values.push(userId);

                                await conn.query(updateQuery, values);

                                const [updated] = await conn.query(
                                                'SELECT id_user, nom, prenom, email, sport, niveau FROM user WHERE id_user = ?',
                                                [userId]
                                );

                                res.status(200).json({ message: 'Profil mis à jour', user: updated[0] });
                } catch (error) {
                                console.error('Erreur complementProfile:', error);
                                res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
                } finally {
                                if (conn) conn.release();
                }
};

// REFRESH TOKEN
exports.refreshToken = (req, res) => {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                                return res.status(401).json({ error: 'Refresh token manquant' });
                }

                try {
                                const secret = process.env.JWT_SECRET;
                                const decoded = jwt.verify(refreshToken, secret);
                                const newToken = jwt.sign({ id_user: decoded.id_user }, secret, { expiresIn: '1h' });
                                res.json({ token: newToken });
                } catch (error) {
                                return res.status(403).json({ error: 'Refresh token invalide ou expiré' });
                }
};

// MODIFIER PROFIL (nom/prenom/email)
exports.updateProfile = async (req, res) => {
                let conn;
                try {
                                const { nom, prenom, email } = req.body;
                                const userId = req.user.id_user;

                                if (!nom && !prenom && !email) {
                                                return res.status(400).json({ error: 'Aucun champ fourni.' });
                                }

                                conn = await pool.getConnection();

                                const [check] = await conn.query('SELECT * FROM user WHERE id_user = ?', [userId]);
                                if (!check || check.length === 0) {
                                                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
                                }

                                const fields = [];
                                const values = [];

                                if (nom) { fields.push('nom = ?'); values.push(nom); }
                                if (prenom) { fields.push('prenom = ?'); values.push(prenom); }
                                if (email) { fields.push('email = ?'); values.push(email); }

                                const updateQuery = `UPDATE user SET ${fields.join(', ')} WHERE id_user = ?`;
                                values.push(userId);

                                await conn.query(updateQuery, values);

                                const [updated] = await conn.query(
                                                'SELECT id_user, nom, prenom, email FROM user WHERE id_user = ?',
                                                [userId]
                                );

                                res.status(200).json({ message: 'Profil mis à jour', user: updated[0] });
                } catch (error) {
                                console.error('Erreur updateProfile:', error);
                                res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
                } finally {
                                if (conn) conn.release();
                }
};

// DEMANDE ADMIN
exports.requestAdmin = async (req, res) => {
                const userId = req.user.id_user;
                let conn;
                try {
                                conn = await pool.getConnection();

                                // Mettre à jour uniquement la demande, pas l'admin direct
                                await conn.query('UPDATE user SET admin_request = 1 WHERE id_user = ?', [userId]);

                                res.status(200).json({ message: 'Demande envoyée avec succès.' });
                } catch (err) {
                                console.error(" Erreur dans requestAdmin :", err);
                                res.status(500).json({ error: "Erreur serveur." });
                } finally {
                                if (conn) conn.release();
                }
};

exports.approveAdmin = async (req, res) => {
                // Vérifie si c'est Luc qui fait la demande
                if (req.user.email !== 'lucma@gmail.com') {
                                return res.status(403).json({ error: "Seul l'admin principal peut valider les demandes." });
                }

                const { id_user } = req.body; // L’ID du futur admin à promouvoir
                let conn;
                try {
                                conn = await pool.getConnection();
                                await conn.query('UPDATE user SET is_admin = TRUE, admin_request = FALSE WHERE id_user = ?', [id_user]);
                                res.status(200).json({ message: 'Utilisateur promu administrateur avec succès.' });
                } catch (err) {
                                console.error("Erreur dans approveAdmin:", err);
                                res.status(500).json({ error: "Erreur serveur." });
                } finally {
                                if (conn) conn.release();
                }
};



exports.getAdminRequests = async (req, res) => {
                let conn;
                try {
                                conn = await pool.getConnection();
                                const [users] = await conn.query('SELECT id_user, nom, prenom, email FROM user WHERE admin_request = 1');
                                res.status(200).json({ users });
                } catch (err) {
                                res.status(500).json({ error: "Erreur lors de la récupération des demandes." });
                } finally {
                                if (conn) conn.release();
                }
};



