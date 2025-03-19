document.addEventListener('DOMContentLoaded', async function () {
                // Récupérer les informations utilisateur depuis localStorage
                let user = JSON.parse(localStorage.getItem('user'));
                let token = localStorage.getItem('token');

                if (!user || !token) {
                                alert('Aucun utilisateur connecté. Redirection vers la page de connexion.');
                                window.location.href = 'connexion.html';
                                return;
                }

                // Vérifier si le token est valide, sinon le rafraîchir
                token = await ensureTokenValid(token);
                if (!token) return; // Si le token est invalide après rafraîchissement, redirection

                // Affichage des informations utilisateur
                updateProfileUI(user);

                // Ouvrir le formulaire de complétion de profil
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

                // Fermer le formulaire de complétion
                window.closeEditForm = function () {
                                document.getElementById('editForm').style.display = 'none';
                                document.getElementById('overlay').style.display = 'none';
                };

                // Sauvegarder les informations complémentaires du profil
                window.saveProfile = async function (event) {
                                event.preventDefault();

                                const complementUser = {
                                                // On ne modifie pas les informations existantes, on complète uniquement
                                                sport: document.getElementById('editSport').value.trim(),
                                                niveau: document.getElementById('editLevel').value.trim(),
                                };

                                try {
                                                // Vérifier si le token est valide avant d'envoyer la requête
                                                token = await ensureTokenValid(token);
                                                if (!token) return;

                                                console.log("Données envoyées :", complementUser);
                                                console.log("Token envoyé :", token);

                                                const response = await fetch('http://localhost:3000/user/complement', {
                                                                method: 'PUT',
                                                                headers: {
                                                                                'Content-Type': 'application/json',
                                                                                Authorization: `Bearer ${token}`,
                                                                },
                                                                body: JSON.stringify(complementUser),
                                                });

                                                const data = await response.json();
                                                console.log("Réponse serveur :", data);

                                                if (!response.ok) {
                                                                throw new Error(data.error || 'Erreur lors du complément du profil.');
                                                }

                                                // Mise à jour du profil dans localStorage
                                                localStorage.setItem('user', JSON.stringify(data.user));
                                                user = data.user; // Mettre à jour la variable user

                                                // Mise à jour de l'affichage
                                                updateProfileUI(user);

                                                alert('Profil complété avec succès !');
                                                closeEditForm();

                                } catch (error) {
                                                console.error('Erreur:', error);
                                                alert(error.message);
                                }
                };

                // Déconnexion
                document.getElementById('logout-button').addEventListener('click', function () {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                alert('Déconnexion réussie.');
                                window.location.href = 'connexion.html';
                });
});

// 🔄 Rafraîchir le token si expiré
async function refreshToken() {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                                console.error("Aucun refresh token disponible.");
                                window.location.href = 'connexion.html';
                                return null;
                }

                try {
                                const response = await fetch('http://localhost:3000/user/refresh', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ refreshToken })
                                });

                                const data = await response.json();
                                if (!response.ok) throw new Error(data.error);

                                localStorage.setItem('token', data.token); // Met à jour le token
                                console.log('Nouveau token stocké:', data.token);
                                return data.token;
                } catch (error) {
                                console.error('Erreur de rafraîchissement du token:', error);
                                window.location.href = 'connexion.html'; // Forcer la reconnexion
                                return null;
                }
}

// ✅ Vérifier si le token est valide et le rafraîchir si besoin
async function ensureTokenValid(token) {
                if (!token) {
                                console.log("Aucun token présent, tentative de rafraîchissement...");
                                return await refreshToken();
                }
                return token;
}

// 🔄 Mettre à jour l'affichage du profil
function updateProfileUI(user) {
                document.getElementById('userName').textContent = user.nom || 'Non renseigné';
                document.getElementById('userFirstName').textContent = user.prenom || 'Non renseigné';
                document.getElementById('userEmail').textContent = user.email || 'Non renseigné';
                document.getElementById('userSport').textContent = user.sport || 'Non renseigné';
                document.getElementById('userLevel').textContent = user.niveau || 'Non renseigné';
}