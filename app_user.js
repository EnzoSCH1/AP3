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
                                                                                window.location.href = '/Pages/connexion.html';
                                                                })
                                                                .catch(error => {
                                                                                console.error('Erreur:', error);
                                                                                alert('Échec de l\'inscription. Détails de l\'erreur : ' + error.message);
                                                                });
                                });
                }
});



const loginForm = document.getElementById('loginForm');
if (loginForm) {
                loginForm.addEventListener('submit', function (event) {
                                event.preventDefault();

                                const email = document.getElementById('email').value.trim();
                                const mdp = document.getElementById('mdp').value;
                                const rememberMe = document.querySelector('input[name="remember"]').checked;

                                if (!validateLogin(email, mdp)) {
                                                return;
                                }

                                fetch('http://localhost:3000/user/login', {
                                                method: 'POST',
                                                headers: {
                                                                'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                                email,
                                                                password: mdp,
                                                                rememberMe
                                                })
                                })
                                                .then(response => {
                                                                if (!response.ok) {
                                                                                throw new Error('Identifiants incorrects');
                                                                }
                                                                return response.json();
                                                })
                                                .then(data => {
                                                                // Stocker le token dans localStorage ou un cookie
                                                                localStorage.setItem('token', data.token);

                                                                // Redirection vers la page d'accueil après une connexion réussie
                                                                window.location.href = '/Pages/ap2.html';
                                                })
                                                .catch(error => {
                                                                console.error('Erreur de connexion:', error);
                                                                alert('Échec de la connexion. Vérifiez vos identifiants.');
                                                });
                });
}


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

// Fonction de validation de la connexion
function validateLogin(email, mdp) {
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
