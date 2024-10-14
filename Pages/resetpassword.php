<?php
// Configuration de la base de données
$port = 3306 ;
$dbname = 'test_db';
$user = 'user';
$passwd = 'passwd';

// Variable utilisée pour afficher une notification d'erreur ou de succès
$msg = '';

// Connexion à la base de données
try {
    $db = new PDO("mysql:host=localhost;port=$port;dbname=m2l", $user, $passwd); // Remplacez $pass par $passwd
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Vérification du token
if (empty($_GET['token'])) {
    die('Aucun token n\'a été spécifié');
}

// Récupération des informations liées au token
$query = $db->prepare('SELECT password_recovery_asked_date FROM users WHERE password_recovery_token = ?');
$query->execute([$_GET['token']]);
$row = $query->fetch(PDO::FETCH_ASSOC);

if (empty($row)) {
    die('Ce token n\'a pas été trouvé');
}

// Vérification de la validité du token (3 heures)
$tokenDate = strtotime('+3 hours', strtotime($row['password_recovery_asked_date']));
$todayDate = time();

if ($tokenDate < $todayDate) {
    die('Token expiré !');
}

// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($_POST['new_password']) && !empty($_POST['confirm_password'])) {
        if ($_POST['new_password'] === $_POST['confirm_password']) {
            // Hashage et mise à jour du mot de passe
            $password = password_hash($_POST['new_password'], PASSWORD_DEFAULT);
            $updateQuery = $db->prepare('UPDATE users SET mdp = ?, password_recovery_token = "" WHERE password_recovery_token = ?'); // Utilisez mdp ici
            
            if ($updateQuery->execute([$password, $_GET['token']])) {
                $msg = '<div style="color: green;">Le mot de passe a été changé avec succès !</div>';
            } else {
                $msg = '<div style="color: red;">Une erreur est survenue lors de la mise à jour du mot de passe.</div>';
            }
        } else {
            $msg = '<div style="color: red;">Les deux mots de passe ne sont pas identiques.</div>';
        }
    } else {
        $msg = '<div style="color: red;">Veuillez remplir tous les champs du formulaire.</div>';
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialiser le mot de passe</title>
    <link rel="stylesheet" href="../style css/formulaire.css">
</head>
<body>
    <div class="wrapper">
        <div class="form-box resetpassword">
            <h1>Réinitialiser le mot de passe</h1>
            <?php echo $msg; ?>
            <form action="" method="POST">
                <div class="input-box">
                    <input type="password" name="new_password" placeholder="Nouveau mot de passe" required />
                </div>
                <div class="input-box">
                    <input type="password" name="confirm_password" placeholder="Confirmer le mot de passe" required />
                </div>
                <button type="submit">Mettre à jour le mot de passe</button>
            </form>
        </div>
    </div>
</body>
</html>
