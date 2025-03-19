document.addEventListener('DOMContentLoaded', function () {
                console.log("Script chargé !");
                console.log("Vérification des informations de connexion...");
                console.log("User ID:", localStorage.getItem('user_id'));
                // Affichage partiel du token pour la sécurité
                const token = localStorage.getItem('token');
                console.log("Token présent:", token ? "Oui" : "Non");

                const urlParams = new URLSearchParams(window.location.search);
                let spaceId = urlParams.get('space_id');

                if (!spaceId || isNaN(spaceId)) {
                                alert("Erreur : Aucun ID d'espace trouvé dans l'URL.");
                                return;
                }

                spaceId = Number(spaceId);

                const spaces = {
                                1: { name: 'Salle de Sport', price: 50.00 },
                                2: { name: 'Salle de Conférence', price: 100.00 },
                                3: { name: 'Terrain Extérieur', price: 30.00 },
                                4: { name: 'Location de Matériel', price: 75.00 }
                };

                document.getElementById('spaceName').textContent = spaces[spaceId].name;
                document.getElementById('pricePerDay').textContent = spaces[spaceId].price.toFixed(2);

                const startDateInput = document.getElementById('start_date');
                const endDateInput = document.getElementById('end_date');
                const submitButton = document.getElementById('reserver');

                function updatePrice() {
                                if (!startDateInput.value || !endDateInput.value) return;

                                const startDate = new Date(startDateInput.value);
                                const endDate = new Date(endDateInput.value);

                                if (isNaN(startDate.getTime())) {
                                                alert("Date de début invalide.");
                                                return;
                                }
                                if (isNaN(endDate.getTime())) {
                                                alert("Date de fin invalide.");
                                                return;
                                }
                                if (endDate <= startDate) {
                                                alert("La date de fin doit être après la date de début.");
                                                return;
                                }

                                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                                const total = days * spaces[spaceId].price;

                                document.getElementById('duration').textContent = `${days} jour(s)`;
                                document.getElementById('totalAmount').textContent = total.toFixed(2);
                                submitButton.disabled = false;
                }

                startDateInput.addEventListener('change', updatePrice);
                endDateInput.addEventListener('change', updatePrice);

                document.getElementById('formReservation').addEventListener('submit', async function (e) {
                                e.preventDefault();

                                const token = localStorage.getItem('token');
                                const userId = localStorage.getItem('user_id');

                                if (!userId || !token) {
                                                alert("Vous devez être connecté pour effectuer une réservation.");
                                                return;
                                }

                                const data = {
                                                user_id: parseInt(userId, 10), // Conversion explicite en nombre
                                                id_spaces: spaceId,
                                                start_date: startDateInput.value,
                                                end_date: endDateInput.value,
                                                total_amount: parseFloat(document.getElementById('totalAmount').textContent) || 0
                                };

                                console.log("Données envoyées:", data);

                                try {
                                                // Vérifier que le serveur est en fonctionnement avant d'envoyer la requête
                                                const pingResponse = await fetch('http://localhost:3000/', {
                                                                method: 'GET',
                                                                headers: { 'Content-Type': 'application/json' }
                                                }).catch(error => {
                                                                console.error("Serveur non accessible:", error);
                                                                throw new Error("Le serveur n'est pas accessible. Vérifiez qu'il est bien démarré sur le port 3000.");
                                                });

                                                console.log("Envoi de la requête de réservation...");
                                                console.log("URL:", 'http://localhost:3000/reservations/create');
                                                console.log("Authorization:", `Bearer ${token.substring(0, 10)}...`);

                                                const response = await fetch('http://localhost:3000/reservations/create', {
                                                                method: 'POST',
                                                                headers: {
                                                                                'Content-Type': 'application/json',
                                                                                'Authorization': `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify(data)
                                                });

                                                // Afficher les détails de la réponse brute pour le débogage
                                                console.log("Statut de la réponse:", response.status);
                                                console.log("Headers de la réponse:", Object.fromEntries([...response.headers]));

                                                let result;
                                                const contentType = response.headers.get("content-type");
                                                if (contentType && contentType.includes("application/json")) {
                                                                result = await response.json();
                                                                console.log("Contenu JSON de la réponse:", result);
                                                } else {
                                                                const text = await response.text();
                                                                console.log("Contenu texte de la réponse:", text);
                                                                result = { message: text || "Format de réponse inattendu" };
                                                }

                                                if (response.ok) {
                                                                alert("Réservation créée avec succès !");
                                                                window.location.href = `/reservation-confirmation.html?reservation_id=${result.reservationId}`;
                                                } else {
                                                                alert(`Erreur: ${result.message || result.error || "Erreur inconnue - Status " + response.status}`);
                                                }
                                } catch (error) {
                                                console.error("Erreur lors de la requête:", error);
                                                alert(`Erreur lors de la communication avec le serveur: ${error.message}`);
                                }
                });
});