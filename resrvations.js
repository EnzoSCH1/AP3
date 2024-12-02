async function makeAuthenticatedRequest(url, method, body = null) {
                const token = localStorage.getItem('authToken');
                const headers = {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                };

                try {
                                const response = await fetch('http://localhost:3000/reservations/create', {
                                                method,
                                                headers,
                                                body: body ? JSON.stringify(body) : null,
                                });

                                if (!response.ok) {
                                                let errorMessage = 'Une erreur est survenue';
                                                try {
                                                                const errorData = await response.json();
                                                                errorMessage = errorData.error || errorMessage;
                                                } catch {
                                                                // La réponse n'est pas au format JSON
                                                }
                                                throw new Error(errorMessage);
                                }

                                // Retourner la réponse JSON ou un objet vide si aucune donnée
                                if (response.headers.get('Content-Length') === '0') {
                                                return {};
                                }

                                return await response.json();
                } catch (error) {
                                console.error('Erreur de requête:', error);
                                alert(error.message);
                                throw error;
                }
}

// Gestion du formulaire de réservation
document.getElementById('formReservation').addEventListener('submit', async function (e) {
                e.preventDefault();

                const space_id = document.getElementById('space_id').value;
                const start_date = document.getElementById('start_date').value;
                const end_date = document.getElementById('end_date').value;

                try {
                                const result = await makeAuthenticatedRequest('/reservations/create', 'POST', {
                                                space_id,
                                                start_date,
                                                end_date
                                });

                                alert(result.message);
                                // Redirection ou rechargement après réservation
                                window.location.href = '../Pages/reservations.html'; // Ajustez selon votre structure
                } catch (error) {
                                console.error('Erreur lors de la soumission:', error);
                }
});