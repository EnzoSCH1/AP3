<?php
session_start(); // Démarrer la session au début du script

$port = 3306;
$user = 'root';
$pass = '';

try {
    $db = new PDO("mysql:host=localhost;port=$port;dbname=m2l", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur : " . $e->getMessage());
}

if (isset($_POST['reset_password'])) {
    $email = trim($_POST['email']);

    if (empty($email)) {
        $error = "Veuillez entrer votre adresse e-mail.";
    } else {
        try {
            $requete = $db->prepare("SELECT * FROM user WHERE email = :email");
            $requete->execute(['email' => $email]);
            $user = $requete->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // Ici, tu peux générer un lien de réinitialisation et l'envoyer par email
                // Pour le test, nous allons simplement afficher un message de succès
                $success = "Un e-mail de réinitialisation a été envoyé à $email.";
            } else {
                $error = "Aucun utilisateur trouvé avec cet e-mail.";
            }
        } catch (PDOException $e) {
            $error = "Erreur de base de données";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialiser le mot de passe</title>
    <link rel="stylesheet" href="/style css/formulaire.css">
</head>

<body>
    <div class="wrapper">
        <div class="form-box">
            <form action="" method="POST">
                <h1>Réinitialiser le mot de passe</h1>

                <div class="input-box">
                    <input type="email" name="email" placeholder="Entrez votre e-mail" required />
                </div>

                <button type="submit" name="reset_password">Réinitialiser</button>

                <!-- Affichage des messages d'erreur ou de succès -->
                <?php if (isset($error)): ?>
                    <div class="error-message"><?php echo $error; ?></div>
                <?php elseif (isset($success)): ?>
                    <div class="success-message"><?php echo $success; ?></div>
                <?php endif; ?>
            </form>
        </div>
    </div>
</body>

</html>
