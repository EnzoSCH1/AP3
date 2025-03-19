const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../database');

/**
 * Créer un paiement pour une réservation
 */
exports.createPaymentIntent = async (req, res) => {
                try {
                                const { reservation_id } = req.body;

                                if (!reservation_id) {
                                                return res.status(400).json({ message: "ID de réservation requis" });
                                }

                                const connection = await pool.getConnection();
                                try {
                                                // Récupérer les détails de la réservation
                                                const [reservations] = await connection.query(
                                                                `SELECT total_amount FROM reservations WHERE id = ? AND payment_status = 'PENDING'`,
                                                                [reservation_id]
                                                );

                                                if (reservations.length === 0) {
                                                                return res.status(404).json({ message: "Réservation introuvable ou déjà payée" });
                                                }

                                                const amount = Math.round(reservations[0].total_amount * 100); // Convertir en centimes

                                                // Créer un Payment Intent Stripe
                                                const paymentIntent = await stripe.paymentIntents.create({
                                                                amount: amount,
                                                                currency: 'eur',
                                                                payment_method_types: ['card']
                                                });

                                                res.status(200).json({ clientSecret: paymentIntent.client_secret });

                                } finally {
                                                connection.release();
                                }

                } catch (error) {
                                console.error("Erreur Stripe :", error);
                                res.status(500).json({ message: "Erreur serveur", error: error.message });
                }
};

/**
 * Confirmer le paiement et mettre à jour la base de données
 */
exports.confirmPayment = async (req, res) => {
                try {
                                const { reservation_id, paymentIntentId, payment_method } = req.body;

                                if (!reservation_id || !paymentIntentId) {
                                                return res.status(400).json({ message: "Données de paiement incomplètes" });
                                }

                                const connection = await pool.getConnection();
                                try {
                                                await connection.beginTransaction();

                                                // Vérifier si le paiement Stripe est bien réussi
                                                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                                                if (paymentIntent.status !== 'succeeded') {
                                                                await connection.rollback();
                                                                return res.status(400).json({ message: "Paiement non validé" });
                                                }

                                                // Récupérer le montant de la réservation
                                                const [reservations] = await connection.query(
                                                                `SELECT total_amount FROM reservations WHERE id = ?`,
                                                                [reservation_id]
                                                );

                                                if (reservations.length === 0) {
                                                                await connection.rollback();
                                                                return res.status(404).json({ message: "Réservation introuvable" });
                                                }

                                                const total_amount = reservations[0].total_amount;

                                                // Insérer le paiement dans la table `payments`
                                                const [paymentResult] = await connection.query(
                                                                `INSERT INTO payments (reservation_id, payment_status, amount, payment_method, payment_reference, payment_date, created_at, updated_at) 
                             VALUES (?, 'PAID', ?, ?, ?, NOW(), NOW(), NOW())`,
                                                                [reservation_id, total_amount, payment_method, paymentIntentId]
                                                );

                                                const payment_id = paymentResult.insertId;

                                                // Mettre à jour la réservation avec le statut payé et le payment_id
                                                await connection.query(
                                                                `UPDATE reservations SET payment_status = 'PAID', payment_id = ? WHERE id = ?`,
                                                                [payment_id, reservation_id]
                                                );

                                                await connection.commit();
                                                res.status(200).json({ message: "Paiement confirmé et enregistré", payment_id });

                                } catch (error) {
                                                await connection.rollback();
                                                console.error("Erreur confirmation paiement :", error);
                                                res.status(500).json({ message: "Erreur serveur", error: error.message });
                                } finally {
                                                connection.release();
                                }
                } catch (error) {
                                console.error("Erreur serveur :", error);
                                res.status(500).json({ message: "Erreur interne du serveur" });
                }
};
