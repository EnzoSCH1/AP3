// Controllers/reservationController.js
const db = require('../database');

exports.createReservation = async (req, res) => {
    const { space_id, start_date, end_date } = req.body;
    const user_id = req.user.id_user;

    if (!space_id || !start_date || !end_date) {
        return res.status(400).json({ message: 'Champs manquants' });
    }

    try {
        const [space] = await db.query(
            'SELECT price_per_day FROM spaces WHERE id = ?',
            [space_id]
        );

        if (!space || space.length === 0) {
            return res.status(404).json({ message: 'Espace introuvable' });
        }

        const pricePerDay = space[0].price_per_day;
        const durationInDays = Math.ceil(
            (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)
        );
        const total_amount = pricePerDay * durationInDays;

        await db.query(
            `INSERT INTO reservations (user_id, space_id, start_date, end_date, total_amount) 
       VALUES (?, ?, ?, ?, ?)`,
            [user_id, space_id, start_date, end_date, total_amount]
        );

        res.status(201).json({ message: 'Réservation créée avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la réservation" });
    }
};

exports.cancelReservation = async (req, res) => {
    const { reservation_id } = req.body;
    const user_id = req.user.id_user;

    try {
        const [reservation] = await db.query(
            'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
            [reservation_id, user_id]
        );

        if (reservation.length === 0) {
            return res.status(404).json({ message: 'Réservation introuvable' });
        }

        await db.query(
            'UPDATE reservations SET payment_status = "CANCELLED" WHERE id = ?',
            [reservation_id]
        );

        res.status(200).json({ message: 'Réservation annulée' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de l'annulation" });
    }
};
