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
                                profileIcon.style.marginRight = '15px'; // Un petit espacement à droite
                                authButtons.appendChild(profileIcon);

                                // Ajoute un lien vers la page de réservation à droite
                                const reservationLink = document.createElement('a');
                                reservationLink.href = '../Pages/reservations.html'; // Mets ici l'URL correcte de la page de réservation
                                reservationLink.innerText = 'Réservation';
                                reservationLink.style.fontSize = '28px'; // Taille du texte ajustée
                                reservationLink.style.color = '#000000';
                                authButtons.appendChild(reservationLink);

                                // Ajoute un lien vers la page de réservation à droite
                                const evenementLink = document.createElement('a');
                                evenementLink.href = '../Pages/reservations.html'; // Mets ici l'URL correcte de la page de réservation
                                evenementLink.innerText = 'Réservation';
                                evenementLink.style.fontSize = '28px'; // Taille du texte ajustée
                                evenementLink.style.color = '#000000';
                                authButtons.appendChild(reservationLink);
                }
} else {
                console.error("Élément '.auth-buttons' non trouvé dans la page.");
}
