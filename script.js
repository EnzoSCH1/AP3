// Gestion du menu responsive
document.getElementById('toggler').addEventListener('click', function () {
                document.querySelector('.menu').classList.toggle('active');
});

// Vérification de l'état de connexion
const isLoggedIn = localStorage.getItem('token') !== null;
if (isLoggedIn) {
                // Masquer les liens de connexion et d'inscription
                document.getElementById('login-link').style.display = 'none';
                document.getElementById('register-link').style.display = 'none';
                // Afficher l'icône de profil
                document.getElementById('profile-icon').style.display = 'block';
}

// Gestion du formulaire d'inscription
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                // Récupération des valeurs avec les bons IDs
                const nom = document.getElementById('nom').value;
                const prenom = document.getElementById('prenom').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('mdp').value; // Changé pour correspondre à l'ID HTML

                // Validation basique
                if (!nom || !prenom || !email || !password) {
                                alert('Veuillez remplir tous les champs');
                                return;
                }

                try {
                                const response = await fetch('/api/register', {
                                                method: 'POST',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({ nom, prenom, email, password }),
                                });

                                const data = await response.json();

                                if (response.ok) {
                                                console.log('Inscription réussie:', data);
                                                // Ajout d'un message de succès pour l'utilisateur
                                                alert('Inscription réussie! Vous allez être redirigé vers la page de connexion.');
                                                window.location.href = '/Pages/connexion.html'; // Chemin corrigé
                                } else {
                                                // Affichage plus détaillé des erreurs
                                                const errorMessage = data.error || 'Une erreur est survenue lors de l\'inscription';
                                                alert(errorMessage);
                                                console.error('Erreur lors de l\'inscription:', errorMessage);
                                }
                } catch (error) {
                                console.error('Erreur de connexion au serveur:', error);
                                alert('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
                }
});

// Ajout d'une fonction de validation en temps réel
document.querySelectorAll('#registerForm input').forEach(input => {
                input.addEventListener('input', function () {
                                this.classList.remove('error');
                                if (!this.value) {
                                                this.classList.add('error');
                                }
                });
});

function togglePasswordVisibility() {
                const passwordField = document.getElementById('mdp');
                const toggleIcon = document.getElementById('togglePassword');

                if (passwordField.type === 'password') {
                                passwordField.type = 'text';
                                toggleIcon.classList.remove('fa-eye');
                                toggleIcon.classList.add('fa-eye-slash');
                } else {
                                passwordField.type = 'password';
                                toggleIcon.classList.remove('fa-eye-slash');
                                toggleIcon.classList.add('fa-eye');
                }
}


// Gestion du formulaire de connexion
const loginForm = document.getElementById('loginForm');
const errorDiv = document.createElement('div');
errorDiv.id = 'error-message';
errorDiv.style.color = 'red';
loginForm.appendChild(errorDiv);

loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                try {
                                const response = await fetch('/api/login', {
                                                method: 'POST',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({ email, password }),
                                });

                                const data = await response.json();

                                if (response.ok) {
                                                // Stockage du token JWT
                                                localStorage.setItem('token', data.token);

                                                // Masquer les liens de connexion/inscription
                                                document.getElementById('login-link').style.display = 'none';
                                                document.getElementById('register-link').style.display = 'none';

                                                // Afficher l'icône de profil
                                                document.getElementById('profile-icon').style.display = 'block';

                                                // Message de succès (optionnel)
                                                alert('Connexion réussie !');

                                                // Redirection vers la page d'accueil
                                                window.location.href = '../'; // ou '/' selon votre structure
                                } else {
                                                errorDiv.textContent = data.error || 'Erreur lors de la connexion';
                                }
                } catch (error) {
                                errorDiv.textContent = 'Erreur de connexion au serveur';
                                console.error('Erreur:', error);
                }
});


// Gestion de la déconnexion (si vous avez un bouton de déconnexion)
const logoutButton = document.getElementById('logout-button'); // Ajoutez cet ID à votre bouton de déconnexion
if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                                // Supprimer le token
                                localStorage.removeItem('token');

                                // Réafficher les liens de connexion/inscription
                                document.getElementById('login-link').style.display = 'block';
                                document.getElementById('register-link').style.display = 'block';

                                // Masquer l'icône de profil
                                document.getElementById('profile-icon').style.display = 'none';

                                // Rediriger vers la page d'accueil
                                window.location.href = '/index.html'; // ou '/' selon votre structure
                });
}

//update password

// Vérifier si l'utilisateur est connecté
// function checkAuth() {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                                 window.location.href = '/Pages/connexion.html';
//                 }
//                 return token;
// }

// Récupérer les données de l'utilisateur depuis le serveur
async function getUserData() {
                const token = checkAuth();
                try {
                                const response = await fetch('/api/user/profile', {
                                                headers: {
                                                                'Authorization': ` ${token}`
                                                }
                                });
                                if (response.ok) {
                                                return await response.json();
                                } else {
                                                throw new Error('Erreur lors de la récupération des données');
                                }
                } catch (error) {
                                console.error('Erreur:', error);
                                return null;
                }
}

// Remplir le profil avec les données de l'utilisateur
async function fillUserProfile() {
                const userData = await getUserData();
                if (userData) {
                                document.getElementById('userName').textContent = userData.nom;
                                document.getElementById('userFirstName').textContent = userData.prenom;
                                document.getElementById('userEmail').textContent = userData.email;
                                document.getElementById('userSport').textContent = userData.sport || 'Non renseigné';
                                document.getElementById('userLevel').textContent = userData.niveau || 'Non renseigné';
                }
}

// Ouvrir le formulaire d'édition
async function openEditForm() {
                const userData = await getUserData();
                if (userData) {
                                document.getElementById('editNom').value = userData.nom;
                                document.getElementById('editPrenom').value = userData.prenom;
                                document.getElementById('editEmail').value = userData.email;
                                document.getElementById('editSport').value = userData.sport || '';
                                document.getElementById('editLevel').value = userData.niveau || '';
                }
                document.getElementById('overlay').style.display = 'block';
                document.getElementById('editForm').style.display = 'block';
}

// Fermer le formulaire d'édition
function closeEditForm() {
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('editForm').style.display = 'none';
}

// Sauvegarder les données modifiées
async function saveProfile(event) {
                event.preventDefault();
                const token = checkAuth();

                const updatedData = {
                                nom: document.getElementById('editNom').value,
                                prenom: document.getElementById('editPrenom').value,
                                email: document.getElementById('editEmail').value,
                                sport: document.getElementById('editSport').value,
                                niveau: document.getElementById('editLevel').value
                };

                if (document.getElementById('editPassword').value) {
                                updatedData.password = document.getElementById('editPassword').value;
                }

                try {
                                const response = await fetch('/api/user/update-profile', {
                                                method: 'PUT',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `${token}`
                                                },
                                                body: JSON.stringify(updatedData)
                                });

                                if (response.ok) {
                                                alert('Profil mis à jour avec succès !');
                                                await fillUserProfile(); // Recharger les données du profil
                                                closeEditForm();
                                } else {
                                                const error = await response.json();
                                                alert(error.message || 'Erreur lors de la mise à jour du profil');
                                }
                } catch (error) {
                                console.error('Erreur:', error);
                                alert('Erreur de connexion au serveur');
                }
}


