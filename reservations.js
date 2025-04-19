document.addEventListener("DOMContentLoaded", () => {
                const token = localStorage.getItem("token");
                const spaceIdInput = document.getElementById("space_id");
                const form = document.getElementById("formReservation");

                // ✅ Page: reserve.html (formulaire de réservation)
                if (spaceIdInput && form) {
                                const urlParams = new URLSearchParams(window.location.search);
                                const space_id = urlParams.get("space_id");
                                spaceIdInput.value = space_id;

                                const priceDisplay = document.getElementById("pricePerDay");
                                const totalAmountEl = document.getElementById("totalAmount");
                                const durationEl = document.getElementById("duration");

                                // Charger le prix depuis l'API
                                fetch(`http://localhost:3000/spaces/${space_id}`)
                                                .then(res => res.json())
                                                .then(data => {
                                                                priceDisplay.textContent = data.price_per_day;
                                                })
                                                .catch(() => {
                                                                alert("Erreur lors du chargement du lieu");
                                                });

                                form.addEventListener("input", () => {
                                                const start = new Date(document.getElementById("start_date").value);
                                                const end = new Date(document.getElementById("end_date").value);
                                                if (start && end && end > start) {
                                                                const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                                                                durationEl.textContent = `${duration} jours`;
                                                                totalAmountEl.textContent = (duration * parseFloat(priceDisplay.textContent)).toFixed(2);
                                                                document.getElementById("reserver").disabled = false;
                                                }
                                });

                                form.addEventListener("submit", async (e) => {
                                                e.preventDefault();
                                                if (!token) return alert("Veuillez vous connecter.");

                                                try {
                                                                const res = await fetch("http://localhost:3000/reservations/create", {
                                                                                method: "POST",
                                                                                headers: {
                                                                                                "Content-Type": "application/json",
                                                                                                Authorization: `Bearer ${token}`,
                                                                                },
                                                                                body: JSON.stringify({
                                                                                                space_id,
                                                                                                start_date: form.start_date.value,
                                                                                                end_date: form.end_date.value,
                                                                                }),
                                                                });

                                                                const data = await res.json();
                                                                if (!res.ok) return alert(data.error || "Erreur lors de la réservation");

                                                                alert("✅ Réservation créée !");
                                                                form.reset();
                                                                durationEl.textContent = "---";
                                                                totalAmountEl.textContent = "---";
                                                                document.getElementById("reserver").disabled = true;
                                                } catch (err) {
                                                                console.error("Erreur submit:", err);
                                                                alert("Erreur de communication avec le serveur.");
                                                }
                                });
                }

                // ✅ Page: reservations.html → aucun traitement ici pour l'instant
                // (Si besoin plus tard, tu peux ajouter ici des appels fetch pour afficher les espaces dynamiquement)
});
