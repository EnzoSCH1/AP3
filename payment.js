document.addEventListener("DOMContentLoaded", async function () {
                const stripe = Stripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"); // Ta clé publique Stripe

                const reservationId = localStorage.getItem('reservation_id');
                if (!reservationId) {
                                alert("Aucune réservation trouvée");
                                return;
                }

                const token = localStorage.getItem('token');

                // Récupérer le clientSecret depuis le backend
                const response = await fetch("http://localhost:3000/payment/payment-intent", {
                                method: "POST",
                                headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify({ reservation_id: reservationId })
                });

                const data = await response.json();
                const clientSecret = data.clientSecret;

                document.getElementById("amount").textContent = (data.amount / 100).toFixed(2);

                const elements = stripe.elements();
                const cardElement = elements.create("card");
                cardElement.mount("#card-element");

                const form = document.getElementById("payment-form");
                form.addEventListener("submit", async function (event) {
                                event.preventDefault();

                                const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                                                payment_method: { card: cardElement }
                                });

                                if (error) {
                                                document.getElementById("payment-message").textContent = error.message;
                                } else {
                                                // Envoyer la confirmation au backend
                                                const response = await fetch("http://localhost:3000/reservations/confirm-payment", {
                                                                method: "POST",
                                                                headers: {
                                                                                "Content-Type": "application/json",
                                                                                "Authorization": `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({
                                                                                reservation_id: reservationId,
                                                                                paymentIntentId: paymentIntent.id,
                                                                                payment_method: "card"
                                                                })
                                                });

                                                const result = await response.json();
                                                document.getElementById("payment-message").textContent = result.message;
                                }

                });
});
