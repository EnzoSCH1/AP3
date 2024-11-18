const jwt = require('jsonwebtoken');
const db = require('../database');

const getEmailFromToken = (token) => {
                try {
                                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                                return decoded.email;
                } catch (err) {
                                return null;
                }
};

exports.isAdmin = async (req, res, next) => {
                const token = req.query.token || req.headers.authorization;

                if (!token) {
                                return res.status(401).json({ error: 'Access denied. Token not provided.' });
                }

                const email = getEmailFromToken(token);

                if (!email) {
                                return res.status(401).json({ error: 'Invalid token.' });
                }

                try {
                                const conn = await db.pool.getConnection();
                                const result = await conn.query('SELECT is_admin FROM user WHERE email = ?', [email]);
                                conn.release();

                                if (result.length === 1 && result[0].is_admin === 1) {
                                                next();
                                } else {
                                                res.status(403).json({ error: 'Permission denied. Admin access required.' });
                                }
                } catch (error) {
                                console.error(error);
                                res.status(500).json({ error: 'Internal server error.' });
                }
};
