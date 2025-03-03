const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../database');

/**
 * Créer une réservation avec un statut initial PENDING
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */


exports.checkAvailability = async (req, res) => {
    const { id_spaces, start_date, end_date } = req.body;

    const connection = await pool.getConnection();
    try {
        // Vérifier les réservations existantes qui se chevauchent
        const [overlappingReservations] = await connection.query(`
            SELECT id FROM reservations 
            WHERE id_spaces = ? 
            AND payment_status IN ('PENDING', 'PAID')
            AND (
                (start_date <= ? AND end_date >= ?) OR
                (start_date <= ? AND end_date >= ?) OR
                (start_date >= ? AND end_date <= ?)
            )
        `, [id_spaces, start_date, start_date, end_date, end_date, start_date, end_date]);

        const isAvailable = overlappingReservations.length === 0;

        res.status(200).json({
            available: isAvailable,
            conflicting_reservations: isAvailable ? [] : overlappingReservations
        });

    } catch (error) {
        console.error('Erreur lors de la vérification de disponibilité:', error);
        res.status(500).json({
            error: 'Erreur lors de la vérification de disponibilité',
            details: error.message
        });
    } finally {
        connection.release();
    }
};

exports.createReservation = async (req, res) => {
    const {
        user_id,
        id_spaces,
        start_date,
        end_date,
        total_amount
    } = req.body;

    // Validation des entrées
    if (!user_id || !id_spaces || !start_date || !end_date || !total_amount) {
        return res.status(400).json({
            message: 'Données de réservation incomplètes',
            requiredFields: ['user_id', 'id_spaces', 'start_date', 'end_date', 'total_amount']
        });
    }

    const connection = await pool.getConnection();

    try {
        // Début de la transaction
        await connection.beginTransaction();

        // Création de la réservation avec statut PENDING
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const query = `
            INSERT INTO reservations (
                user_id, 
                start_date, 
                end_date, 
                payment_status, 
                created_at, 
                total_amount, 
                id_spaces
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [results] = await connection.query(query, [
            user_id,
            start_date,
            end_date,
            'PENDING',
            createdAt,
            total_amount,
            id_spaces
        ]);

        // Log de la création de réservation
        await connection.query(
            'INSERT INTO reservation_logs (reservation_id, action, details, user_id) VALUES (?, ?, ?, ?)',
            [results.insertId, 'RESERVATION_CREATED', JSON.stringify(req.body), user_id]
        );

        // Validation et commit de la transaction
        await connection.commit();

        res.status(201).json({
            message: 'Réservation créée avec succès',
            reservationId: results.insertId,
            status: 'PENDING'
        });

    } catch (error) {
        // Annulation de la transaction
        await connection.rollback();

        console.error('Erreur lors de la création de la réservation:', error);

        res.status(500).json({
            message: 'Erreur lors de la création de la réservation',
            errorDetails: error.message
        });
    } finally {
        // Libération de la connexion
        connection.release();
    }
};

/**
 * Payer une réservation existante
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
exports.payReservation = async (req, res) => {
    const {
        reservation_id,
        payment_method_id
    } = req.body;
    const user_id = req.user.id;

    // Validation des entrées
    if (!reservation_id || !payment_method_id) {
        return res.status(400).json({
            message: 'Données de paiement incomplètes',
            requiredFields: ['reservation_id', 'payment_method_id']
        });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Récupération des détails de la réservation
        const [reservations] = await connection.query(
            'SELECT * FROM reservations WHERE id = ? AND user_id = ? AND payment_status = "PENDING"',
            [reservation_id, user_id]
        );

        if (reservations.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                error: 'Réservation non trouvée ou déjà payée',
                details: { reservation_id, user_id }
            });
        }

        const reservation = reservations[0];

        // Créer un PaymentIntent Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(reservation.total_amount * 100),  // Montant en centimes
            currency: 'eur',
            payment_method: payment_method_id,
            confirm: true,
            description: `Réservation #${reservation_id} - Espace ${reservation.id_spaces}`
        });

        // Mise à jour de la réservation
        await connection.query(
            'UPDATE reservations SET payment_status = "PAID", payment_id = ? WHERE id = ?',
            [paymentIntent.id, reservation_id]
        );

        // Log du paiement
        await connection.query(
            'INSERT INTO reservation_logs (reservation_id, action, details, user_id) VALUES (?, ?, ?, ?)',
            [reservation_id, 'PAYMENT_COMPLETED', JSON.stringify({
                paymentIntent,
                reservationDetails: reservation
            }), user_id]
        );

        await connection.commit();
        res.status(200).json({
            message: 'Paiement effectué avec succès',
            reservationId: reservation_id,
            paymentDetails: {
                id: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                status: paymentIntent.status
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Erreur de paiement:', error);

        res.status(500).json({
            error: 'Erreur de paiement de la réservation',
            details: error.message
        });
    } finally {
        connection.release();
    }
};

/**
 * Annuler une réservation en attente de paiement
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
exports.cancelReservation = async (req, res) => {
    const {
        reservation_id,
        cancellation_reason
    } = req.body;
    const user_id = req.user.id;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Vérifier si la réservation existe et est en attente
        const [reservations] = await connection.query(
            'SELECT * FROM reservations WHERE id = ? AND user_id = ? AND payment_status = "PENDING"',
            [reservation_id, user_id]
        );

        if (reservations.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                error: 'Réservation non trouvée ou déjà payée/annulée',
                details: { reservation_id, user_id }
            });
        }

        // Annuler la réservation
        await connection.query(
            'UPDATE reservations SET payment_status = "CANCELLED", cancellation_reason = ? WHERE id = ?',
            [cancellation_reason || 'Annulation par l\'utilisateur', reservation_id]
        );

        // Log de l'annulation
        await connection.query(
            'INSERT INTO reservation_logs (reservation_id, action, details, user_id) VALUES (?, ?, ?, ?)',
            [reservation_id, 'RESERVATION_CANCELLED', JSON.stringify({
                reason: cancellation_reason,
                reservationDetails: reservations[0]
            }), user_id]
        );

        await connection.commit();
        res.status(200).json({
            message: 'Réservation annulée avec succès',
            reservationId: reservation_id
        });

    } catch (error) {
        await connection.rollback();
        console.error('Erreur d\'annulation:', error);

        res.status(500).json({
            error: 'Erreur lors de l\'annulation de la réservation',
            details: error.message
        });
    } finally {
        connection.release();
    }
};

/**
 * Récupérer les réservations d'un utilisateur
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
exports.getUserReservations = async (req, res) => {
    const user_id = req.user.id; // Supposant que l'authentificateur ajoute l'ID utilisateur

    const connection = await pool.getConnection();
    try {
        // Récupérer toutes les réservations de l'utilisateur
        const [reservations] = await connection.query(
            `SELECT 
                id, 
                id_spaces, 
                start_date, 
                end_date, 
                payment_status, 
                total_amount, 
                created_at 
            FROM reservations 
            WHERE user_id = ? 
            ORDER BY created_at DESC`,
            [user_id]
        );

        res.status(200).json({
            message: 'Réservations récupérées avec succès',
            reservations: reservations
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);

        res.status(500).json({
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    } finally {
        connection.release();
    }
};