document.addEventListener('DOMContentLoaded', async function () {
                let token = localStorage.getItem('token');
                let user = localStorage.getItem('user');

                if (!token) {
                                alert("Aucun utilisateur connecté");
                                return window.location.href = "connexion.html";
                }

                // Vérifie la validité du token
                token = await ensureTokenValid(token);
                if (!token) return;

                // Appelle l'API pour récupérer les infos mises à jour
                try {
                                const res = await fetch("http://localhost:3000/user/profile", {
                                                headers: {
                                                                Authorization: `Bearer ${token}`
                                                }
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error);

                                user = data.user;
                                localStorage.setItem('user', JSON.stringify(user));
                                updateProfileUI(user);
                } catch (err) {
                                console.error("Erreur lors de la récupération du profil :", err);
                                alert("Impossible de charger le profil");
                }

                // Boutons
                document.getElementById('logout-button').addEventListener('click', function () {
                                localStorage.clear();
                                window.location.href = 'connexion.html';
                });

                window.openEditForm = () => {
                                document.getElementById('editForm').style.display = 'block';
                                document.getElementById('overlay').style.display = 'block';
                                const u = JSON.parse(localStorage.getItem('user'));
                                document.getElementById('editNom').value = u.nom || '';
                                document.getElementById('editPrenom').value = u.prenom || '';
                                document.getElementById('editEmail').value = u.email || '';
                                document.getElementById('editSport').value = u.sport || '';
                                document.getElementById('editLevel').value = u.niveau || '';
                };

                window.closeEditForm = () => {
                                document.getElementById('editForm').style.display = 'none';
                                document.getElementById('overlay').style.display = 'none';
                };

                window.saveProfile = async function (e) {
                                e.preventDefault();
                                const body = {
                                                sport: document.getElementById('editSport').value,
                                                niveau: document.getElementById('editLevel').value
                                };

                                try {
                                                const res = await fetch("http://localhost:3000/user/complement", {
                                                                method: "PUT",
                                                                headers: {
                                                                                'Content-Type': 'application/json',
                                                                                Authorization: `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify(body)
                                                });

                                                const data = await res.json();
                                                if (!res.ok) throw new Error(data.error);
                                                alert("Profil mis à jour");
                                                localStorage.setItem("user", JSON.stringify(data.user));
                                                updateProfileUI(data.user);
                                                closeEditForm();
                                } catch (err) {
                                                alert("Erreur : " + err.message);
                                }
                };
});

// Mise à jour UI
function updateProfileUI(user) {
                document.getElementById('userName').textContent = user.nom || "Non renseigné";
                document.getElementById('userFirstName').textContent = user.prenom || "Non renseigné";
                document.getElementById('userEmail').textContent = user.email || "Non renseigné";
                document.getElementById('userSport').textContent = user.sport || "Non renseigné";
                document.getElementById('userLevel').textContent = user.niveau || "Non renseigné";
}

// Rafraîchir le token
async function refreshToken() {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) return null;
                try {
                                const res = await fetch("http://localhost:3000/user/refresh", {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ refreshToken })
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error);
                                localStorage.setItem('token', data.token);
                                return data.token;
                } catch (err) {
                                console.error("Erreur token :", err);
                                return null;
                }
}

async function ensureTokenValid(token) {
                return token || await refreshToken();
}
