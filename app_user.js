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

// Gestionnaire du formulaire d'inscription
document.addEventListener('DOMContentLoaded', function () {
                const registerForm = document.getElementById('registerForm');
                if (registerForm) {
                                registerForm.addEventListener('submit', async function (event) {
                                                event.preventDefault();

                                                const nom = document.getElementById('nom').value.trim();
                                                const prenom = document.getElementById('prenom').value.trim();
                                                const email = document.getElementById('email').value.trim();
                                                const mdp = document.getElementById('mdp').value;

                                                if (!validateForm(nom, prenom, email, mdp)) {
                                                                return;
                                                }

                                                try {
                                                                const response = await fetch('http://localhost:3000/user/register', {
                                                                                method: 'POST',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ nom, prenom, email, password: mdp })
                                                                });

                                                                if (response.ok) {
                                                                                alert('✅ Inscription réussie !');
                                                                                window.location.href = 'connexion.html';
                                                                } else {
                                                                                alert('❌ Erreur d\'inscription');
                                                                }
                                                } catch (error) {
                                                                alert('❌ Erreur de connexion au serveur');
                                                }
                                });
                }

                // Gestionnaire du formulaire de connexion
                const loginForm = document.getElementById('loginForm');
                if (loginForm) {
                                loginForm.addEventListener('submit', async function (event) {
                                                event.preventDefault();

                                                const email = document.getElementById('email').value.trim();
                                                const mdp = document.getElementById('mdp').value;

                                                if (!validateLogin(email, mdp)) {
                                                                return;
                                                }

                                                try {
                                                                const response = await fetch('http://localhost:3000/user/login', {
                                                                                method: 'POST',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ email, password: mdp })
                                                                });

                                                                if (response.ok) {
                                                                                const data = await response.json();
                                                                                console.log("🔑 Réponse du serveur :", data);

                                                                                // ✅ Stocker correctement l'ID utilisateur et le token
                                                                                localStorage.setItem('user_id', data.user.id_user); // Correction ici
                                                                                localStorage.setItem('token', data.token);

                                                                                alert("✅ Connexion réussie !");
                                                                                window.location.href = 'ap2.html';
                                                                } else {
                                                                                showError('❌ Erreur de connexion');
                                                                }
                                                } catch (error) {
                                                                showError('❌ Erreur de connexion au serveur');
                                                }
                                });
                }
});

// Fonction de validation de l'inscription
function validateForm(nom, prenom, email, mdp) {
                if (!nom || !prenom) {
                                alert('❌ Nom et prénom sont requis');
                                return false;
                }
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(email)) {
                                alert('❌ Adresse email invalide');
                                return false;
                }
                if (!mdp) {
                                alert('❌ Mot de passe requis');
                                return false;
                }
                return true;
}

// Fonction de validation de la connexion
function validateLogin(email, mdp) {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!email || !emailRegex.test(email)) {
                                showError('❌ Email invalide');
                                return false;
                }
                if (!mdp) {
                                showError('❌ Mot de passe requis');
                                return false;
                }
                return true;
}

// Fonction pour afficher les erreurs
function showError(message) {
                const errorDiv = document.getElementById('loginError') || createErrorDiv();
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
}

// Créer un div pour les erreurs
function createErrorDiv() {
                const loginForm = document.getElementById('loginForm');
                const errorDiv = document.createElement('div');
                errorDiv.id = 'loginError';
                errorDiv.style.color = 'red';
                errorDiv.style.marginTop = '10px';
                loginForm.appendChild(errorDiv);
                return errorDiv;
}
