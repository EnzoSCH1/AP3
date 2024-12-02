document.addEventListener('DOMContentLoaded', function () {
                // Récupérer les informations utilisateur depuis localStorage
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user) {
                                alert('Aucun utilisateur connecté. Redirection vers la page de connexion.');
                                window.location.href = 'connexion.html'; // Redirection si pas d'utilisateur connecté
                                return;
                }

                // Affichage des informations utilisateur
                document.getElementById('userName').textContent = user.nom || 'Non renseigné';
                document.getElementById('userFirstName').textContent = user.prenom || 'Non renseigné';
                document.getElementById('userEmail').textContent = user.email || 'Non renseigné';
                document.getElementById('userSport').textContent = user.sport || 'Non renseigné';
                document.getElementById('userLevel').textContent = user.niveau || 'Non renseigné';

                // Ouvrir le formulaire d'édition
                window.openEditForm = function () {
                                document.getElementById('editForm').style.display = 'block';
                                document.getElementById('overlay').style.display = 'block';

                                // Pré-remplir les champs avec les informations actuelles
                                document.getElementById('editNom').value = user.nom || '';
                                document.getElementById('editPrenom').value = user.prenom || '';
                                document.getElementById('editEmail').value = user.email || '';
                                document.getElementById('editSport').value = user.sport || '';
                                document.getElementById('editLevel').value = user.niveau || '';
                };

                // Fermer le formulaire d'édition
                window.closeEditForm = function () {
                                document.getElementById('editForm').style.display = 'none';
                                document.getElementById('overlay').style.display = 'none';
                };

                // Sauvegarder les modifications du profil
                window.saveProfile = function (event) {
                                event.preventDefault();

                                const updatedUser = {
                                                nom: document.getElementById('editNom').value.trim(),
                                                prenom: document.getElementById('editPrenom').value.trim(),
                                                email: document.getElementById('editEmail').value.trim(),
                                                sport: document.getElementById('editSport').value.trim(),
                                                niveau: document.getElementById('editLevel').value.trim(),
                                };

                                const newPassword = document.getElementById('editPassword').value.trim();

                                // Mise à jour sur le serveur
                                fetch('http://localhost:3000/user/update', {
                                                method: 'PUT',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                                                },
                                                body: JSON.stringify({
                                                                ...updatedUser,
                                                                password: newPassword || undefined, // Envoie seulement si un mot de passe est renseigné
                                                }),
                                })
                                                .then(response => {
                                                                if (!response.ok) {
                                                                                throw new Error('Erreur lors de la mise à jour du profil.');
                                                                }
                                                                return response.json();
                                                })
                                                .then(data => {
                                                                // Mise à jour du profil dans localStorage
                                                                localStorage.setItem('user', JSON.stringify(data.user));

                                                                // Mise à jour de l'affichage
                                                                document.getElementById('userName').textContent = data.user.nom || 'Non renseigné';
                                                                document.getElementById('userFirstName').textContent = data.user.prenom || 'Non renseigné';
                                                                document.getElementById('userEmail').textContent = data.user.email || 'Non renseigné';
                                                                document.getElementById('userSport').textContent = data.user.sport || 'Non renseigné';
                                                                document.getElementById('userLevel').textContent = data.user.niveau || 'Non renseigné';

                                                                alert('Profil mis à jour avec succès !');
                                                                closeEditForm();
                                                })
                                                .catch(error => {
                                                                console.error('Erreur:', error);
                                                                alert('Échec de la mise à jour. Veuillez réessayer.');
                                                });
                };

                // Déconnexion
                document.getElementById('logout-button').addEventListener('click', function () {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                alert('Déconnexion réussie.');
                                window.location.href = 'connexion.html';
                });
});
