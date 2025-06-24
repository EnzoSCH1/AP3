document.addEventListener('DOMContentLoaded', () => {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user') || '{}');

                if (!token || !user || user.is_admin !== 1) {
                                showAlert("Accès réservé aux administrateurs", 'error');
                                setTimeout(() => window.location.href = 'articles.html', 2000);
                                return;
                }

                document.getElementById('article-form').addEventListener('submit', async (e) => {
                                e.preventDefault();

                                const titre = document.getElementById('titre').value.trim();
                                const contenu = document.getElementById('contenu').value.trim();
                                const image = document.getElementById('image').files[0];

                                if (!titre || !contenu) {
                                                showAlert("Le titre et le contenu sont obligatoires", 'error');
                                                return;
                                }

                                const formData = new FormData();
                                formData.append('titre', titre);
                                formData.append('contenu', contenu);
                                if (image) formData.append('image', image);

                                try {
                                                const res = await fetch('http://localhost:3000/articles/create', {
                                                                method: 'POST',
                                                                headers: { 'Authorization': 'Bearer ' + token },
                                                                body: formData
                                                });

                                                const data = await res.json();
                                                if (res.ok) {
                                                                showAlert(data.message || 'Article publié avec succès !', 'success');
                                                                document.getElementById('article-form').reset();
                                                } else {
                                                                showAlert(data.error || 'Erreur lors de la publication', 'error');
                                                                console.error('❌ Erreur détaillée:', data);
                                                }
                                } catch (err) {
                                                console.error('❌ Erreur réseau:', err);
                                                showAlert('Erreur de communication avec le serveur', 'error');
                                }
                });
});

function showAlert(message, type) {
                const alert = document.getElementById('alert');
                alert.textContent = message;
                alert.className = `alert alert-${type}`;
                alert.style.display = 'block';

                setTimeout(() => { alert.style.display = 'none'; }, 5000);
}
