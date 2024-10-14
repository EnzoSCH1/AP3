<?php


session_start(); // Démarrer la session au début du script

$user = 'root';
$pass = '';

try {
    $db = new PDO('mysql:host=localhost;dbname=m2l', $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print "Erreur : " . $e->getMessage() . "<br/>";
    die();
}

// Gérer l'inscription
if (isset($_POST['Inscription'])) {
    // Vérifier si les champs sont remplis
    if (empty($_POST['nom']) || empty($_POST['prenom']) || empty($_POST['pseudo']) || 
        empty($_POST['mdp']) || empty($_POST['email'])) {
        header("Location: /Pages/inscription.html?error=empty_fields");
        exit();
    }

    // Vérifier si le pseudo ou l'email n'existe pas déjà
    $check = $db->prepare("SELECT COUNT(*) FROM user WHERE pseudo = :pseudo OR email = :email");
    $check->execute([
        "pseudo" => $_POST['pseudo'],
        "email" => $_POST['email']
    ]);
    
    if ($check->fetchColumn() > 0) {
        header("Location: /Pages/inscription.php?error=already_exists");
        exit();
    }

    $nom = htmlspecialchars($_POST['nom']);
    $prenom = htmlspecialchars($_POST['prenom']);
    $pseudo = htmlspecialchars($_POST['pseudo']);
    $mdp = password_hash($_POST['mdp'], PASSWORD_DEFAULT);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    try {
        $requete = $db->prepare("INSERT INTO user (pseudo, nom, prenom, password, email) VALUES (:pseudo, :nom, :prenom, :mdp, :email)");
        $requete->execute([
            "pseudo" => $pseudo,
            "nom" => $nom,
            "prenom" => $prenom,
            "mdp" => $mdp,
            "email" => $email,
        ]);

        // Redirection en cas de succès
        header("Location: /Pages/connexion.php?success=registered");
        exit();
    } catch(PDOException $e) {
        header("Location: /Pages/inscription.php?error=database_error");
        exit();
    }
}

// Gérer la connexion
if (isset($_POST['Connexion'])) {
    if (empty($_POST['username']) || empty($_POST['password'])) {
        header("Location: /Pages/connexion.php?error=empty_fields");
        exit();
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    try {
        $requete = $db->prepare("SELECT * FROM user WHERE pseudo = :username OR email = :username");
        $requete->execute([
            "username" => $username
        ]);

        $user = $requete->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['pseudo'] = $user['pseudo'];
            
           
            header("Location: dashboard.php");
            exit();
        } else {
            header("Location: /Pages/connexion.php?error=invalid_credentials");
            exit();
        }
    } catch(PDOException $e) {
        header("Location: /Pages/connexion.php?error=database_error");
        exit();
    }
}




?>