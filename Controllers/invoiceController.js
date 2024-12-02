const { generateInvoicePdf } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailSender');
const db = require('../database'); // On suppose que tu utilises une base de données avec db.query

const createInvoice = async (req, res) => {
                try {
                                const { items, paid } = req.body;
                                const userId = req.user.id_user; // ID de l'utilisateur connecté

                                // Récupérer les informations de l'utilisateur directement depuis la base de données
                                const [client] = await db.query('SELECT * FROM users WHERE id_user = ?', [userId]);

                                if (!client) {
                                                return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
                                }

                                // Calcul du total
                                const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

                                // Génération du PDF
                                const pdfPath = await generateInvoicePdf({
                                                client: {
                                                                id_user: client.id_user,
                                                                nom: client.nom,
                                                                prenom: client.prenom,
                                                                email: client.email,
                                                                date_inscription: client.date_inscription,
                                                },
                                                items,
                                                total,
                                                paid,
                                });

                                // Envoi de l'email avec la facture en pièce jointe
                                await sendEmail(
                                                client.email,
                                                'Votre facture',
                                                `<p>Bonjour ${client.prenom}, veuillez trouver votre facture en pièce jointe.</p>`,
                                                pdfPath
                                );

                                // Réponse de succès
                                res.status(200).json({ success: true, message: 'Facture générée et envoyée avec succès.' });
                } catch (error) {
                                console.error(error);
                                res.status(500).json({ success: false, message: error.message });
                }
};

module.exports = { createInvoice };
