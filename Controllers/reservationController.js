const { pool } = require('../database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createReservation = async (req, res) => {
    const { space_id, start_date, end_date } = req.body;
    const user_id = req.user.id;

    // Validation des entrées
    if (!space_id || !start_date || !end_date) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Vérifier la disponibilité de l'espace
        const [existingReservations] = await connection.query(
            `SELECT * FROM reservations 
             WHERE space_id = ? 
             AND payment_status != "CANCELLED" 
             AND (
                 (start_date <= ? AND end_date >= ?) OR 
                 (start_date <= ? AND end_date >= ?)
             )`,
            [space_id, start_date, start_date, end_date, end_date]
        );

        if (existingReservations.length > 0) {
            return res.status(400).json({ error: 'Espace déjà réservé pour ces dates' });
        }

        // Insérer la réservation
        const [result] = await connection.query(
            `INSERT INTO reservations (user_id, space_id, start_date, end_date, payment_status) 
             VALUES (?, ?, ?, ?, "PENDING")`,
            [user_id, space_id, start_date, end_date]
        );

        // Log de la réservation
        await connection.query(
            `INSERT INTO reservation_logs (reservation_id, action, details, user_id) 
             VALUES (?, ?, ?, ?)`,
            [result.insertId, 'RESERVATION_CREATED', JSON.stringify(req.body), user_id]
        );

        await connection.commit();
        res.status(201).json({
            message: 'Réservation créée avec succès',
            reservationId: result.insertId,
        });
    } catch (error) {
        await connection.rollback();
        console.error('Erreur lors de la création de réservation:', error);
        res.status(500).json({ error: 'Erreur de création de réservation' });
    } finally {
        connection.release();
    }
};

exports.payReservation = async (req, res) => {
    const { reservation_id, payment_method_id } = req.body;
    const user_id = req.user.id;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Vérifier si la réservation existe
        const [reservation] = await connection.query(
            'SELECT * FROM reservations WHERE id = ? AND user_id = ? AND payment_status = "PENDING"',
            [reservation_id, user_id]
        );

        if (reservation.length === 0) {
            return res.status(404).json({ error: 'Réservation non trouvée ou déjà payée' });
        }

        // Créer un paiement via Stripe (assurez-vous d'avoir un montant défini)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // Montant en centimes (à ajuster)
            currency: 'eur',
            payment_method: payment_method_id,
            confirm: true,
        });

        // Mettre à jour le statut de la réservation
        await connection.query(
            'UPDATE reservations SET payment_status = "PAID", payment_intent_id = ? WHERE id = ?',
            [paymentIntent.id, reservation_id]
        );

        // Log du paiement
        await connection.query(
            'INSERT INTO reservation_logs (reservation_id, action, details, user_id) VALUES (?, ?, ?, ?)',
            [reservation_id, 'PAYMENT_RECEIVED', JSON.stringify({ paymentIntent }), user_id]
        );

        await connection.commit();
        res.status(200).json({
            message: 'Paiement effectué avec succès',
            reservationId: reservation_id,
        });
    } catch (error) {
        await connection.rollback();
        console.error('Erreur de paiement:', error);
        res.status(500).json({ error: 'Erreur de paiement de la réservation' });
    } finally {
        connection.release();
    }
};

exports.cancelReservation = async (req, res) => {
    const { reservation_id } = req.body;
    const user_id = req.user.id;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Vérifier si la réservation existe
        const [reservation] = await connection.query(
            'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
            [reservation_id, user_id]
        );

        if (reservation.length === 0) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        // Annuler la réservation
        await connection.query(
            'UPDATE reservations SET payment_status = "CANCELLED" WHERE id = ?',
            [reservation_id]
        );

        // Log de l'annulation
        await connection.query(
            'INSERT INTO reservation_logs (reservation_id, action, details, user_id) VALUES (?, ?, ?, ?)',
            [reservation_id, 'RESERVATION_CANCELLED', JSON.stringify({ reservation_id }), user_id]
        );

        await connection.commit();
        res.status(200).json({
            message: 'Réservation annulée avec succès',
            reservationId: reservation_id,
        });
    } catch (error) {
        await connection.rollback();
        console.error('Erreur d\'annulation:', error);
        res.status(500).json({ error: 'Erreur d\'annulation de la réservation' });
    } finally {
        connection.release();
    }
};

exports.getUserReservations = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const userId = req.user.id;

        // Récupérer toutes les réservations de l'utilisateur
        const [reservations] = await connection.query(
            'SELECT * FROM reservations WHERE user_id = ?',
            [userId]
        );

        res.status(200).json(reservations);
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        res.status(500).json({ error: "Erreur lors de la récupération des réservations" });
    } finally {
        connection.release();
    }
};