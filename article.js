document.querySelectorAll('img').forEach(img => {
                img.addEventListener('click', function () {
                                // Vérifie l'ID ou l'alt de l'image pour déterminer l'article
                                let content = '';

                                if (img.alt === 'basket') {
                                                content = `
                            <img src="../image/basket.png" alt="Basket">
                            <br>
                            <h1>Basket. SLUC Nancy Espoirs : Iliam Fevry, un diamant à polir</h1>
                            <p>Le SLUC Nancy a fait venir l’espoir Iliam Févry (1,96 m, 18 ans) pour la saison 2024-2025. Parti très jeune en Espagne après avoir été repéré sous les couleurs du programme privé FRENCHY PHENOMS, cet arrière a été champion d’Espagne U14 avec la sélection d’Andalousie. Il a plus récemment évolué au sein du centre de formation du Bétis Séville tout en disputant l’Adidas Next Generation Tournament (ANGT) de Paris avec la Joventut Badalone. Convoqué en équipe de France U18 cet été, il n’a pas été sélectionné pour le championnat d’Europe à Tampere, en Finlande. Iliam Févry revient donc en France, chez le champion de France Espoirs 2024, le SLUC Nancy. Il prendra la succession du MVP de la saison, Guillaume Grotzinger, à la mène des U21.</p>
                        `;
                                } else if (img.alt === 'foot') {
                                                content = `
                            <img src="../image/foot.png" alt="Football">
                            <br>
                            <h1>Football - Coupe de France</h1>
                            <p>Contenu spécifique à la Coupe de France.</p>
                        `;
                                } else if (img.alt === 'volley') {
                                                content = `
                            <img src="../image/volley.png" alt="Volley">
                            <br>
                            <h1>Le Tfoc n'a pas tenu la distance contre Marcq-en- Barœul</h1>
                            <p>Malgré de bonnes intentions, le Tfoc n'a pas réussi à contenir Marcq-en- Barœul et s'est incliné en quatre sets (1-3).</p>
                        `;
                                }

                                // Injecte le contenu dynamique dans un élément spécifique de la page
                                const contentContainer = document.getElementById('content-container');
                                contentContainer.innerHTML = content;
                });
});
