// Fonction pour masquer/afficher le mot de passe
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

document.addEventListener('DOMContentLoaded', function () {
                // Gestionnaire du formulaire d'inscription
                const registerForm = document.getElementById('registerForm');
                if (registerForm) {
                                registerForm.addEventListener('submit', function (event) {
                                                event.preventDefault();

                                                const nom = document.getElementById('nom').value.trim();
                                                const prenom = document.getElementById('prenom').value.trim();
                                                const email = document.getElementById('email').value.trim();
                                                const mdp = document.getElementById('mdp').value;

                                                if (!validateForm(nom, prenom, email, mdp)) {
                                                                return;
                                                }

                                                fetch('http://localhost:3000/user/register', {
                                                                method: 'POST',
                                                                headers: {
                                                                                'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({
                                                                                nom,
                                                                                prenom,
                                                                                email,
                                                                                password: mdp
                                                                })
                                                })
                                                                .then(response => {
                                                                                if (!response.ok) {
                                                                                                throw new Error('Erreur lors de l\'inscription');
                                                                                }
                                                                                return response.json();
                                                                })
                                                                .then(() => {
                                                                                alert('Inscription réussie !');
                                                                                // Redirection vers la page de connexion
                                                                                window.location.href = 'connexion.html';
                                                                })
                                                                .catch(error => {
                                                                                console.error('Erreur:', error);
                                                                                alert('Échec de l\'inscription. Détails de l\'erreur : ' + error.message);
                                                                });
                                });
                }

                // Gestionnaire du formulaire de connexion
                const loginForm = document.getElementById('loginForm');
                if (loginForm) {
                                loginForm.addEventListener('submit', async function (event) {
                                                event.preventDefault();

                                                const email = document.getElementById('email').value.trim();
                                                const mdp = document.getElementById('mdp').value;
                                                const rememberMe = document.querySelector('input[name="remember"]')?.checked || false;

                                                if (!validateLogin(email, mdp)) {
                                                                return;
                                                }

                                                const submitButton = loginForm.querySelector('button[type="submit"]');
                                                const originalButtonText = submitButton.textContent;

                                                try {
                                                                submitButton.disabled = true;
                                                                submitButton.textContent = 'Connexion en cours...';

                                                                const response = await fetch('http://localhost:3000/user/login', {
                                                                                method: 'POST',
                                                                                headers: {
                                                                                                'Content-Type': 'application/json',
                                                                                },
                                                                                body: JSON.stringify({
                                                                                                email,
                                                                                                password: mdp,
                                                                                                rememberMe,
                                                                                }),
                                                                });

                                                                console.log('Response status:', response.status);
                                                                console.log('Response headers:', Object.fromEntries(response.headers.entries()));

                                                                const responseText = await response.text();
                                                                console.log('Raw response:', responseText);

                                                                let data;
                                                                try {
                                                                                data = JSON.parse(responseText);
                                                                } catch (parseError) {
                                                                                console.error('Erreur de parsing JSON:', parseError);
                                                                                showError('Erreur de réponse du serveur');
                                                                                return;
                                                                }

                                                                console.log('Réponse du serveur:', { status: response.status, data: data });

                                                                if (response.ok) {
                                                                                localStorage.setItem('token', data.token);
                                                                                if (data.user) {
                                                                                                localStorage.setItem('user', JSON.stringify(data.user));
                                                                                }
                                                                                window.location.href = 'ap2.html';
                                                                } else {
                                                                                showError(data.error || 'Une erreur est survenue');
                                                                }
                                                } catch (error) {
                                                                console.error('Erreur de connexion:', error);
                                                                showError('Erreur de connexion au serveur. Veuillez réessayer.');
                                                } finally {
                                                                submitButton.disabled = false;
                                                                submitButton.textContent = originalButtonText;
                                                }
                                });
                }
                // Vérification de connexion pour toutes les pages
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                const authButtons = document.querySelector('.auth-buttons');

                if (authButtons) {
                                if (token && user) {
                                                // Supprime les boutons "Se connecter" et "S'inscrire"
                                                authButtons.innerHTML = '';

                                                // Ajoute l'icône de profil
                                                const profileIcon = document.createElement('a');
                                                profileIcon.href = '/Pages/profile.html';
                                                profileIcon.innerHTML = `<i class="fa-regular fa-user input-icon"></i>`;
                                                profileIcon.style.fontSize = '24px';
                                                profileIcon.style.color = '#ff3333';
                                                profileIcon.title = `Profil de ${user.email}`;
                                                profileIcon.style.marginRight = '15px';  // Un petit espacement à droite
                                                authButtons.appendChild(profileIcon);

                                                // Ajoute un lien vers la page de réservation dans la même liste
                                                const reservationLink = document.createElement('a');
                                                reservationLink.href = '../Pages/reservations.html';  // Mets ici l'URL correcte de la page de réservation
                                                reservationLink.innerText = 'Réservation';
                                                reservationLink.style.fontSize = '28px';  // Taille du texte ajustée
                                                reservationLink.style.color = '#000000';
                                                authButtons.appendChild(reservationLink);
                                }
                } else {
                                console.error("Élément '.auth-buttons' non trouvé dans la page.");
                }

});

// Fonction de validation de l'inscription
function validateForm(nom, prenom, email, mdp) {
                // Vérifier si le nom et prénom ne sont pas vides (pas de limite de caractères)
                if (!nom || !prenom) {
                                alert('Le nom et le prénom sont requis.');
                                return false;
                }

                // Vérification du format de l'email
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(email)) {
                                alert('Veuillez entrer une adresse email valide');
                                return false;
                }

                // Vérification du mot de passe (doit être non vide)
                if (!mdp) {
                                alert('Le mot de passe est requis');
                                return false;
                }

                return true; // Si tout est valide
}

// Fonction pour afficher les erreurs
function showError(message) {
                const errorDiv = document.getElementById('loginError') || createErrorDiv();
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
}

// Créer un div pour les erreurs s'il n'existe pas
function createErrorDiv() {
                const loginForm = document.getElementById('loginForm');
                const errorDiv = document.createElement('div');
                errorDiv.id = 'loginError';
                errorDiv.style.color = 'red';
                errorDiv.style.marginTop = '10px';
                loginForm.appendChild(errorDiv);
                return errorDiv;
}

// Fonction de validation de connexion
function validateLogin(email, mdp) {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if (!email) {
                                showError('L\'email est requis');
                                return false;
                }

                if (!emailRegex.test(email)) {
                                showError('Veuillez entrer une adresse email valide');
                                return false;
                }

                if (!mdp) {
                                showError('Le mot de passe est requis');
                                return false;
                }

                return true;
}


document.addEventListener('DOMContentLoaded', function () {
                const togglerButton = document.getElementById('toggler');
                if (togglerButton) {
                                togglerButton.addEventListener('click', function () {
                                                document.querySelector('.menu').classList.toggle('active');
                                });
                }
});