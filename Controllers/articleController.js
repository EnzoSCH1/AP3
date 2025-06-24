const db = require('../database');

exports.getAllArticles = async (req, res) => {
  try {
    const sql = `SELECT a.*, u.nom, u.prenom 
                 FROM articles a 
                 LEFT JOIN user u ON a.id_auteur = u.id_user 
                 ORDER BY a.date_publication DESC`;

    const [results] = await db.execute(sql);

    console.log('✅ Articles trouvés:', results.length);
    res.status(200).json(results);

  } catch (err) {
    console.error('❌ Erreur SQL getAllArticles:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
  }
};

exports.createArticle = async (req, res) => {
  console.log("📝 Requête reçue pour créer un article");
  console.log("👤 Utilisateur : ", req.user);
  console.log("📁 Fichier : ", req.file);

  try {
    const { titre, contenu } = req.body;
    if (!titre || !contenu) {
      return res.status(400).json({ error: 'Titre et contenu requis' });
    }

    if (!req.user || !req.user.id_user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const image_path = req.file ? req.file.filename : null;
    const id_auteur = req.user.id_user;

    const sql = `INSERT INTO articles (titre, contenu, image_path, id_auteur) 
                 VALUES (?, ?, ?, ?)`;

    const [result] = await db.execute(sql, [titre, contenu, image_path, id_auteur]);

    res.status(201).json({
      message: 'Article publié avec succès',
      articleId: result.insertId
    });

  } catch (err) {
    console.error('❌ Erreur création article:', err);
    res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
  }
};
