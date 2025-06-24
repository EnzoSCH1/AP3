document.addEventListener('DOMContentLoaded', () => {
  showAdminButton();
  loadArticles();
});

function showAdminButton() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.is_admin === 1) {
    const adminActions = document.getElementById("admin-actions");
    if (adminActions) adminActions.style.display = "block";
  }
}

async function loadArticles() {
  try {
    const response = await fetch('http://localhost:3000/articles');
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const articles = await response.json();
    displayArticles(articles);
  } catch (error) {
    console.error('Erreur de chargement des articles:', error);
    document.getElementById('articles').innerHTML = `
        <div class="error">
            <h3>❌ Erreur de chargement</h3>
            <p>Impossible de charger les articles. Vérifiez que le serveur est démarré.</p>
            <p><strong>Détail:</strong> ${error.message}</p>
        </div>`;
  }
}

function displayArticles(articles) {
  const container = document.getElementById('articles');
  if (!Array.isArray(articles) || articles.length === 0) {
    container.innerHTML = `
        <div class="no-articles">
            <h3>📝 Aucun article</h3>
            <p>Aucun article n'a encore été publié.</p>
        </div>`;
    return;
  }

  container.innerHTML = articles.map(article => `
        <div class="article">
            <h3>${escapeHtml(article.titre)}</h3>
            <div class="article-content">
                ${escapeHtml(article.contenu).replace(/\n/g, '<br>')}
            </div>
            ${article.image_path ? `<img src="http://localhost:3000/uploads/${article.image_path}" alt="Image" class="article-image">` : ''}
            <div class="article-meta">
                👤 Publié par <strong>${escapeHtml(article.nom)} ${escapeHtml(article.prenom)}</strong>
                📅 ${formatDate(article.date_publication)}
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
