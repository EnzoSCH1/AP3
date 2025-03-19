const pool = require('../database');

/**
 * Créer une réservation avec un statut initial PENDING
 */
exports.createReservation = async (req, res) => {
    console.log("✅ Données reçues dans createReservation :", req.body);
    let { user_id, id_spaces, start_date, end_date, total_amount } = req.body;

    // Validation des données
    if (!user_id || !id_spaces || !start_date || !end_date || !total_amount) {
        console.error("❌ Données de réservation incomplètes :", req.body);
        return res.status(400).json({ message: 'Données de réservation incomplètes' });
    }

    // Validation du montant
    total_amount = parseFloat(total_amount);
    if (isNaN(total_amount) || total_amount <= 0) {
        console.error("❌ Montant invalide :", total_amount);
        return res.status(400).json({ message: "Montant invalide" });
    }

    // Validation des dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("❌ Dates invalides :", start_date, end_date);
        return res.status(400).json({ message: "Dates invalides" });
    }
    if (endDate <= startDate) {
        console.error("❌ La date de fin doit être après la date de début :", start_date, end_date);
        return res.status(400).json({ message: "La date de fin doit être après la date de début" });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Vérifier la disponibilité de l'espace
        const [reservations] = await connection.query(
            `SELECT id FROM reservations 
             WHERE id_spaces = ? 
             AND payment_status IN ('PENDING', 'PAID')
             AND (
                 (start_date <= ? AND end_date >= ?) OR
                 (start_date <= ? AND end_date >= ?) OR
                 (start_date >= ? AND end_date <= ?)
             )`,
            [id_spaces, start_date, start_date, end_date, end_date, start_date, end_date]
        );

        if (reservations.length > 0) {
            await connection.rollback();
            console.error(" Espace non disponible pour les dates sélectionnées");
            return res.status(409).json({ message: "Espace non disponible pour les dates sélectionnées" });
        }

        // Créer la réservation
        const [results] = await connection.query(
            `INSERT INTO reservations (user_id, id_spaces, start_date, end_date, payment_status, total_amount) 
             VALUES (?, ?, ?, ?, 'PENDING', ?)`,
            [user_id, id_spaces, start_date, end_date, total_amount]
        );

        await connection.commit();
        console.log(" Réservation créée avec succès :", results.insertId);
        res.status(201).json({ message: 'Réservation créée avec succès', reservationId: results.insertId });
    } catch (error) {
        await connection.rollback();
        console.error(" Erreur lors de la création de la réservation :", error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    } finally {
        connection.release();
    }
};

/**
 * Vérifier la disponibilité d'un espace
 */
exports.checkAvailability = async (req, res) => {
    const { id_spaces, start_date, end_date } = req.body;

    const connection = await pool.getConnection();
    try {
        const [reservations] = await connection.query(`
            SELECT id FROM reservations 
            WHERE id_spaces = ? 
            AND payment_status IN ('PENDING', 'PAID')
            AND (
                (start_date <= ? AND end_date >= ?) OR
                (start_date <= ? AND end_date >= ?) OR
                (start_date >= ? AND end_date <= ?)
            )
        `, [id_spaces, start_date, start_date, end_date, end_date, start_date, end_date]);

        res.status(200).json({
            available: reservations.length === 0,
            conflicting_reservations: reservations
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    } finally {
        connection.release();
    }
};

/**
 * Annuler une réservation
 */
exports.cancelReservation = async (req, res) => {
    const { reservation_id } = req.body;
    const userId = req.user.id_user; // Utilisateur authentifié

    if (!reservation_id) {
        return res.status(400).json({ message: 'ID de réservation requis' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Vérifier si la réservation appartient à l'utilisateur et est encore annulable
        const [reservations] = await connection.query(
            `SELECT * FROM reservations WHERE id = ? AND user_id = ? AND payment_status != 'PAID'`,
            [reservation_id, userId]
        );

        if (reservations.length === 0) {
            await connection.rollback();
            return res.status(403).json({ message: "Impossible d'annuler cette réservation" });
        }

        // Annuler la réservation
        await connection.query(
            `UPDATE reservations SET payment_status = 'CANCELED' WHERE id = ?`,
            [reservation_id]
        );

        await connection.commit();
        res.status(200).json({ message: "Réservation annulée avec succès" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Erreur lors de l'annulation", error: error.message });
    } finally {
        connection.release();
    }
};
