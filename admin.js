document.addEventListener('DOMContentLoaded', async () => {
                const token = localStorage.getItem('token');
                if (!token) return alert("Non autorisé");

                // Rafraîchir les données utilisateur depuis le serveur
                let user;
                try {
                                const profileRes = await fetch("http://localhost:3000/user/profile", {
                                                headers: {
                                                                Authorization: `Bearer ${token}`
                                                }
                                });
                                const profileData = await profileRes.json();
                                user = profileData.user;
                                localStorage.setItem("user", JSON.stringify(user));
                } catch (err) {
                                alert("Impossible de charger le profil.");
                                return;
                }

                // Vérifie si admin
                if (!user || !user.is_admin) {
                                alert("Accès interdit !");
                                return window.location.href = 'ap2.html';
                }

                // Charger les demandes d’admin
                try {
                                const res = await fetch("http://localhost:3000/user/admin/demande-admins", {
                                                headers: {
                                                                'Authorization': `Bearer ${token}`
                                                }
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error);

                                const list = document.getElementById('adminRequests');
                                if (!data.users.length) {
                                                list.innerHTML = "<li>Aucune demande</li>";
                                                return;
                                }

                                data.users.forEach(user => {
                                                const li = document.createElement('li');
                                                li.textContent = `${user.nom} ${user.prenom} (${user.email})`;

                                                const approveBtn = document.createElement('button');
                                                approveBtn.textContent = 'Valider';
                                                approveBtn.onclick = () => approveUser(user.id_user, token);
                                                li.appendChild(approveBtn);

                                                list.appendChild(li);
                                });
                } catch (err) {
                                alert("Erreur lors du chargement des demandes : " + err.message);
                }
});

async function approveUser(id_user, token) {
                try {
                                const res = await fetch("http://localhost:3000/user/approve-admin", {
                                                method: 'POST',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${token}`
                                                },
                                                body: JSON.stringify({ id_user })
                                });

                                const data = await res.json();
                                alert(data.message);
                                window.location.reload();
                } catch (err) {
                                alert("Erreur serveur");
                }
}
