// Fonction pour vérifier si l'utilisateur est connecté
function isAuthenticated() {
                return localStorage.getItem('token') && localStorage.getItem('user_id');
}

// Fonction pour obtenir l'ID de l'utilisateur stocké
function getUserId() {
                return localStorage.getItem('user_id'); // Correction ici, on récupère directement l'ID
}

// Fonction pour récupérer le token
function getToken() {
                return localStorage.getItem('token');
}

// Fonction pour déconnecter l'utilisateur
function logout() {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id'); // Correction ici, suppression correcte de l'ID utilisateur
                window.location.href = 'connexion.html';  // Redirige vers la page de connexion
}

document.addEventListener('DOMContentLoaded', function () {
                const authButtons = document.querySelector('.auth-buttons');

                if (authButtons) {
                                if (isAuthenticated()) {
                                                const userId = getUserId(); // Récupère uniquement l'ID utilisateur
                                                authButtons.innerHTML = ''; // Vide les boutons de connexion

                                                // Créer un lien vers la page de réservation
                                                const reservationLink = document.createElement('a');
                                                reservationLink.href = '../Pages/reservations.html';
                                                reservationLink.innerText = 'Réservation';
                                                reservationLink.classList.add('reservation-link');  // Ajout de la classe CSS
                                                authButtons.appendChild(reservationLink);

                                                // Ajoute l'icône de profil
                                                const profileIcon = document.createElement('a');
                                                profileIcon.href = '/Pages/profile.html';
                                                profileIcon.innerHTML = `<i class="fa-regular fa-user input-icon"></i>`;
                                                profileIcon.style.fontSize = '24px';
                                                profileIcon.style.color = '#ff3333';
                                                profileIcon.title = `Profil de l'utilisateur ${userId}`; // Affiche l'ID utilisateur au lieu de l'email
                                                profileIcon.style.marginRight = '15px';
                                                authButtons.appendChild(profileIcon);

                                                // Créer le lien de déconnexion
                                                const logoutLink = document.createElement('button');
                                                logoutLink.textContent = 'Déconnexion';
                                                logoutLink.classList.add('logout-link');
                                                logoutLink.onclick = logout;
                                                authButtons.appendChild(logoutLink);
                                }
                }
});
