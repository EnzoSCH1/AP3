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

if (isset($_POST['Connexion'])) {
    if (empty($_POST['username']) || empty($_POST['password'])) {
        $error = "Veuillez remplir tous les champs";
    } else {
        $username = trim($_POST['username']);
        $password = $_POST['password'];

        try {
            $requete = $db->prepare("SELECT * FROM user WHERE pseudo = :username OR email = :username");
            $requete->execute(['username' => $username]);
            $user = $requete->fetch(PDO::FETCH_ASSOC);

            // Utiliser 'mdp' pour correspondre à la colonne de la base de données
            if ($user && password_verify($password, $user['mdp'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['pseudo'] = $user['pseudo'];

                // Redirection vers la page HTML après connexion réussie
                header("Location: /Pages/ap2.html");
                exit();
            } else {
                $error = "Identifiants incorrects";
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
    <title>Connexion</title>
    <link rel="stylesheet" href="/style css/formulaire.css">
</head>

<body>
    <div class="wrapper">
        <div class="form-box login">
            <form action="" method="POST"> <!-- Le formulaire envoie les données au même fichier -->
                <h1>Se connecter</h1>

                <div class="input-box">
                    <input type="text" name="username" placeholder="Email ou Pseudo" required />
                    <img src="/image/icons8-message-rempli-60.png" alt="email icon" class="input-icon">
                </div>

                <div class="input-box">
                    <input type="password" name="password" placeholder="Mot de passe" required />
                    <img src="/image/icons8-ouvrir-60.png" alt="password icon" class="input-icon">
                </div>

                <div class="remember-forgot">
                    <label>
                        <input type="checkbox" name="remember"> Se souvenir de moi
                    </label>
                    <p class="forgot-password">
                        <a href="/Pages/forgotpassword.php">Mot de passe oublié?</a>
                    </p>
                </div>

                <button type="submit" name="Connexion">Se connecter</button>

                <div class="register-link">
                    <p>Vous n'avez pas de compte? <a href="/Pages/inscription.php">S'inscrire</a></p>
                </div>

                <!-- Affichage des messages d'erreur -->
                <?php if (isset($error)): ?>
                    <div class="error-message">
                        <?php echo $error; ?>
                    </div>
                <?php endif; ?>
            </form>
        </div>
    </div>
</body>

</html>
