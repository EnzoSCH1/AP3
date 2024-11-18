const results = [
    { team1: 'Équipe A', team2: 'Équipe B', score1: 1, score2: 0 },
    { team1: 'Équipe C', team2: 'Équipe D', score1: 0, score2: 0 },
    { team1: 'Équipe E', team2: 'Équipe F', score1: 1, score2: 1 },
    { team1: 'Équipe G', team2: 'Équipe H', score1: 2, score2: 3 }
  ];

function processResults() {

    const teams = [];
    results.forEach(result => {
      const team1 = { name: result.team1, wins: result.score1 > result.score2 ? 1 : 0, losses: result.score1 < result.score2 ? 1 : 0, points: result.score1 };
      const team2 = { name: result.team2, wins: result.score2 > result.score1 ? 1 : 0, losses: result.score2 < result.score1 ? 1 : 0, points: result.score2 };
      teams.push(team1, team2);
    });
  
    
    teams.sort((a, b) => b.points - a.points);
  
}
function displayResults() {
  const resultsDiv = document.getElementById('results');
  let html = '';
  teams.forEach(team => {
    html += `<div>Équipe: ${team.name} - Victoires: ${team.wins}, Défaites: ${team.losses}, Points: ${team.points}</div>`;
  });
  resultsDiv.innerHTML = html;
}

function displayMatchups() {
  const matchupsDiv = document.getElementById('matchups');
  let html = '';
  results.forEach(result => {
    html += `<div>${result.team1} ${result.score1} - ${result.score2} ${result.team2}</div>`;
  });
  matchupsDiv.innerHTML = html;
}

function main() {
  processResults();
  displayResults();
  displayMatchups();
}

cx
//sfirst code (tableau de victoire et de défaite)

// Données des équipes
const teams = [
  { id: 1, name: "PSG", points: 45, wins: 14, losses: 2 },
  { id: 2, name: "Monaco", points: 38, wins: 11, losses: 5 },
  { id: 3, name: "Lille", points: 35, wins: 10, losses: 6 },
  { id: 4, name: "Marseille", points: 32, wins: 9, losses: 7 },
  { id: 5, name: "Lyon", points: 28, wins: 8, losses: 8 }
];

// Fonction pour afficher les équipes
function displayTeams() {
  const container = document.getElementById('teams-container');
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  
  container.innerHTML = sortedTeams.map((team, index) => `
      <div class="team-card">
          <h3>${index + 1}. ${team.name}</h3>
          <p>Points: ${team.points}</p>
          <p>Victoires: ${team.wins} | Défaites: ${team.losses}</p>
      </div>
  `).join('');
}

// Fonction pour générer les matchs
function generateMatches() {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  return {
      matches: [
          {
              team1: sortedTeams[0],
              team2: sortedTeams[3]
          },
          {
              team1: sortedTeams[1],
              team2: sortedTeams[2]
          }
      ],
      byeTeam: sortedTeams[4]
  };
}

// Fonction pour afficher les matchs
function displayMatches() {
  const container = document.getElementById('matches-container');
  const matchData = generateMatches();
  
  let html = matchData.matches.map(match => `
      <div class="match-card">
          <h3>${match.team1.name} <span class="vs">VS</span> ${match.team2.name}</h3>
          <p>Match basé sur les points</p>
          <p>${match.team1.name}: ${match.team1.points} pts</p>
          <p>${match.team2.name}: ${match.team2.points} pts</p>
      </div>
  `).join('');

  html += `
      <div class="match-card bye-week">
          <h3>Exempt ce tour</h3>
          <p>${matchData.byeTeam.name}</p>
      </div>
  `;

  container.innerHTML = html;
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  displayTeams();
  displayMatches();
});
//1. Initialisation de la Page :
//- Définir la structure HTML de base pour afficher les équipes, les résultats de match, et une section dédiée au matchmaking.
//- Préparer les styles CSS pour rendre la page attrayante et claire.

//2. Récupération des Données :
//- Si les données de résultats sont dans une API ou un fichier JSON :
//  1. Établir une connexion avec la source des données via une requête asynchrone (utilise `fetch` en JavaScript).
  //2. Si les données sont reçues avec succès, continuer avec les étapes suivantes.
  //3./ Si la récupération échoue, affiche un message d'erreur à l'utilisateur.

//3. Traitement des Données de Résultats :
//- Crée une fonction pour interpréter les données reçues :
 // 1. Parcourir les résultats pour extraire les informations importantes (nom des équipes, scores, victoires, etc.).
 // 2. Enregistrer ces informations sous forme de liste ou tableau d’objets pour pouvoir les manipuler facilement.
  //3. Afficher chaque résultat sous forme de carte ou tableau, en regroupant les informations importantes (nom de l’équipe, points gagnés, etc.).

//4. Logique de Matchmaking :
//- Analyser les résultats des équipes et définir des critères de matchmaking (par exemple, même nombre de victoires, de points, ou un classement similaire).
//- Trier la liste des équipes selon le critère choisi (ex. classement par points).
//- Créer une fonction de couplage pour :
//  1. Parcourir la liste triée des équipes en associant les équipes par paires de niveaux similaires.
//  2. Ajouter chaque paire créée dans une nouvelle liste de matchs.

//5. Affichage des Matchups :
//- Créer une fonction pour afficher les matchups générés :
 // 1. Pour chaque paire de la liste de matchs, génère un bloc visuel (carte, tableau) qui montre quelles équipes seront confrontées.
  //2. Afficher chaque bloc dans la section de matchmaking de la page HTML.

///6. Mise à Jour Dynamique :
//- En cas de nouveaux résultats ou de modifications :
//  1. Récupèrer et traiter à nouveau les données de résultats.
//  2. Relancer la logique de matchmaking et mets à jour l’affichage des équipes et des matchups sur la page.
//  3. Effacer les anciens résultats avant de réafficher les nouvelles données pour éviter les doublons.
//
//Résumé en Étapes Clés
//1. Initialiser et styliser la page.
//2. Récupérer et interpréter les données.
//3. Afficher les résultats de chaque équipe.
//4. Analyser les résultats pour faire des paires d’équipes de niveau similaire.
//5. Afficher les matchups.
//6. Mettre à jour dynamiquement lors de changements de données. 

//Exemple de git avec des résultats sportifs
//https://footystats.org/embeds/
//https://github.com/TARANPREETS1999/Sports-website