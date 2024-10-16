<?php
session_start();
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

$port = 3306;
$user = 'root';
$pass = '';

try {
    $db = new PDO("mysql:host=localhost;port=$port;dbname=m2l", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

if (isset($_POST['Inscription'])) {
    if (empty($_POST['nom']) || empty($_POST['prenom']) || empty($_POST['pseudo']) || 
        empty($_POST['mdp']) || empty($_POST['email'])) {
        header("Location: /Pages/inscription.php?error=empty_fields");
        exit();
    }

    $nom = htmlspecialchars($_POST['nom']);
    $prenom = htmlspecialchars($_POST['prenom']);
    $pseudo = htmlspecialchars($_POST['pseudo']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    // Vérification de la longueur des champs
    if (strlen($nom) > 20 || strlen($prenom) > 20 || strlen($pseudo) > 20 || strlen($email) > 20) {
        header("Location: /Pages/inscription.php?error=field_too_long");
        exit();
    }

    $check = $db->prepare("SELECT COUNT(*) FROM user WHERE pseudo = :pseudo OR email = :email");
    $check->execute([
        "pseudo" => $pseudo,
        "email" => $email
    ]);

    if ($check->fetchColumn() > 0) {
        header("Location: /Pages/inscription.php?error=already_exists");
        exit();
    }

    $mdp = password_hash($_POST['mdp'], PASSWORD_DEFAULT);

    try {
        $requete = $db->prepare("INSERT INTO user (pseudo, nom, prenom, mdp, email, date_inscription, token, token_expiry) VALUES (:pseudo, :nom, :prenom, :mdp, :email, NOW(), :token, :token_expiry)");
        $requete->execute([
            "pseudo" => $pseudo,
            "nom" => $nom,
            "prenom" => $prenom,
            "mdp" => $mdp,
            "email" => $email,
            "token" => null,
            "token_expiry" => null
        ]);

        header("Location: /Pages/connexion.php?success=registered");
        exit();
    } catch (PDOException $e) {
        die("Erreur d'inscription : " . $e->getMessage());
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription</title>
    <link rel="stylesheet" href="/style css/formulaire.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div class="wrapper">
        <div class="form-box register">
            <form action="/Pages/inscription.php" method="POST">
                <h1>S'inscrire</h1>

                <div class="input-box">
                    <input type="text" name="nom" placeholder="Nom" required maxlength="20" />
                    <img src="/image/icons8-utilisateur-48.png" alt="user icon" class="input-icon">
                </div>

                <div class="input-box">
                    <input type="text" name="prenom" placeholder="Prénom" required maxlength="20" />
                    <img src="/image/icons8-utilisateur-48.png" alt="user icon" class="input-icon">
                </div>

                <div class="input-box">
                    <input type="text" name="pseudo" placeholder="Pseudo" required maxlength="20" />
                    <img src="/image/icons8-utilisateur-48.png" alt="user icon" class="input-icon">
                </div>

                <div class="input-box">
                    <input type="email" name="email" placeholder="Email" required maxlength="20" />
                    <img src="/image/icons8-message-rempli-60.png" alt="email icon" class="input-icon">
                </div>

                <div class="input-box">
                    <input type="password" name="mdp" placeholder="Mot de passe" required />
                    <img src="/image/icons8-ouvrir-60.png" alt="password icon" class="input-icon">
                </div>

                <button type="submit" name="Inscription">S'inscrire</button>

                <div class="login-link">
                    <p>Vous avez déjà un compte? <a href="/Pages/connexion.php">Se connecter</a></p>
                </div>

                <?php if (isset($_GET['error'])): ?>
                    <div class="error-message">
                        <?php 
                        $error = $_GET['error'];
                        if ($error == "empty_fields") {
                            echo "Veuillez remplir tous les champs.";
                        } elseif ($error == "already_exists") {
                            echo "Le pseudo ou l'email existe déjà.";
                        } elseif ($error == "database_error") {
                            echo "Erreur lors de l'inscription. Veuillez réessayer.";
                        } elseif ($error == "field_too_long") {
                            echo "Un ou plusieurs champs dépassent la longueur maximale autorisée (20 caractères).";
                        }
                        ?>
                    </div>
                <?php endif; ?>

                <?php if (isset($_GET['success'])): ?>
                    <div class="success-message">
                        Inscription réussie ! Vous pouvez vous connecter.
                    </div>
                <?php endif; ?>
            </form>
        </div>
    </div>
</body>
</html>