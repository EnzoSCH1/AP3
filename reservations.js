document.addEventListener('DOMContentLoaded', function () {
                const urlParams = new URLSearchParams(window.location.search);
                const spaceId = urlParams.get('space_id');

                // Configuration des espaces
                const spaces = {
                                1: { name: 'Salle de Sport', price: 50.00 },
                                2: { name: 'Salle de Conférence', price: 100.00 },
                                3: { name: 'Terrain Extérieur', price: 30.00 },
                                4: { name: 'Location de Matériel', price: 75.00 }
                };

                const now = new Date();
                const minDateTime = now.toISOString().slice(0, 16);

                const startDateInput = document.getElementById('start_date');
                const endDateInput = document.getElementById('end_date');
                const submitButton = document.getElementById('reserver');
                const spaceNameElement = document.getElementById('spaceName');

                // Initialiser les champs de date
                startDateInput.min = minDateTime;
                endDateInput.min = minDateTime;

                // Afficher les informations de l'espace
                if (spaceId && spaces[spaceId]) {
                                document.getElementById('space_id').value = spaceId;
                                spaceNameElement.textContent = spaces[spaceId].name;
                                document.getElementById('pricePerDay').textContent = spaces[spaceId].price.toFixed(2);
                } else {
                                spaceNameElement.textContent = 'Espace non trouvé';
                                submitButton.disabled = true; // Désactive le bouton si l'espace n'est pas valide
                                return;
                }

                function validateDates() {
                                const startDate = new Date(startDateInput.value);
                                const endDate = new Date(endDateInput.value);
                                let isValid = true;

                                // Réinitialiser les messages d'erreur
                                document.getElementById('start_date_error').textContent = '';
                                document.getElementById('end_date_error').textContent = '';

                                // Validation des dates
                                if (!startDateInput.value) {
                                                document.getElementById('start_date_error').textContent = 'Veuillez sélectionner une date de début.';
                                                isValid = false;
                                } else if (startDate < now) {
                                                document.getElementById('start_date_error').textContent = 'La date de début ne peut pas être dans le passé.';
                                                isValid = false;
                                }

                                if (!endDateInput.value) {
                                                document.getElementById('end_date_error').textContent = 'Veuillez sélectionner une date de fin.';
                                                isValid = false;
                                } else if (endDate <= startDate) {
                                                document.getElementById('end_date_error').textContent = 'La date de fin doit être après la date de début.';
                                                isValid = false;
                                }

                                return isValid;
                }

                function updatePrice() {
                                if (!validateDates()) {
                                                document.getElementById('duration').textContent = '---';
                                                document.getElementById('totalAmount').textContent = '---';
                                                submitButton.disabled = true; // Désactiver le bouton si les dates ne sont pas valides
                                                return;
                                }

                                const startDate = new Date(startDateInput.value);
                                const endDate = new Date(endDateInput.value);
                                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                                const price = spaces[spaceId].price;
                                const total = days * price;

                                // Mettre à jour l'affichage
                                document.getElementById('duration').textContent = `${days} jour(s)`;
                                document.getElementById('totalAmount').textContent = total.toFixed(2);
                                document.getElementById('total_amount').value = total.toFixed(2);

                                submitButton.disabled = false; // Activer le bouton si tout est valide
                }

                // Écouteurs pour mettre à jour le prix en fonction des dates
                startDateInput.addEventListener('change', updatePrice);
                endDateInput.addEventListener('change', updatePrice);

                // Gestion de la soumission du formulaire
                document.getElementById('formReservation').addEventListener('submit', async function (e) {
                                e.preventDefault();
                                if (!validateDates()) return;

                                submitButton.disabled = true;
                                submitButton.textContent = 'Création en cours...';

                                try {
                                                const formData = new FormData(this);
                                                const data = Object.fromEntries(formData.entries());

                                                // Récupération du jeton depuis localStorage
                                                const token = localStorage.getItem('token');
                                                if (!token) {
                                                                throw new Error('Utilisateur non authentifié. Veuillez vous connecter.');
                                                }

                                                const response = await fetch('http://localhost:3000/reservations/create', {
                                                                method: 'POST',
                                                                headers: {
                                                                                'Content-Type': 'application/json',
                                                                                'Authorization': `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify(data)
                                                });

                                                if (!response.ok) {
                                                                const errorDetails = await response.json();
                                                                throw new Error(errorDetails.message || 'Erreur lors de la création de la réservation.');
                                                }

                                                window.location.href = '/confirmation.html';
                                } catch (error) {
                                                console.error('Erreur:', error);
                                                submitButton.disabled = false;
                                                submitButton.textContent = 'Créer la réservation';
                                                alert('Une erreur est survenue : ' + error.message);
                                }
                });
});
