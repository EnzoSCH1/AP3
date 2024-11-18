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