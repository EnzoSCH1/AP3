const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

const generateInvoicePdf = async ({ client, items, total, paid }) => {
                const pdfPath = path.join(__dirname, `../invoices/invoice-${Date.now()}.pdf`);
                const doc = new PDFDocument();

                doc.pipe(fs.createWriteStream(pdfPath));

                // En-tête de la facture
                doc.fontSize(18).text(`Facture`, { align: 'center' });
                doc.moveDown();

                // Informations sur le client
                doc.fontSize(12).text(`Client : ${client.nom} ${client.prenom}`);
                doc.text(`Email : ${client.email}`);
                doc.text(`Client ID : ${client.id_user}`);
                doc.text(`Date d'inscription : ${client.date_inscription}`);
                doc.text(`Pays : ${client.country || 'Non renseigné'}`); // Si besoin d'ajouter un pays manuellement
                doc.moveDown();

                // Détails des articles
                doc.text('---');
                doc.text('Détails :');
                items.forEach((item, index) => {
                                doc.text(
                                                `${index + 1}. ${item.description} - Quantité : ${item.quantity}, Prix : ${item.price}€`
                                );
                });
                doc.text('---');

                // Total et statut
                doc.text(`Total : ${total}€`);
                doc.text(`Statut : ${paid ? 'Payée' : 'Non payée'}`);
                doc.end();

                return pdfPath;
};

module.exports = { generateInvoicePdf };
