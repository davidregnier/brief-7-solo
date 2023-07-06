const { connection } = require('../server');

const path = (app) => {
  app.get('/blogs', (req, res) => {
    connection.query('SELECT * FROM blogs;', [], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des blogs" });
      } else {
        res.json(results);
      }
    });
  });

  app.get('/blogs/:id', (req, res) => {
    const id_blog = req.params.id;
    connection.query('SELECT * FROM blogs WHERE id_blog = ?;', [id_blog], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Une erreur s'est produite lors de la récupération du blog" });
      } else {
        res.json(results);
      }
    });
  });

  app.get('/users/:id', (req, res) => {
    const id_user = req.params.id;
    connection.query('SELECT * FROM users WHERE id_user = ?;', [id_user], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Une erreur s'est produite lors de la récupération de l'utilisateur" });
      } else {
        res.json(results);
      }
    });
  });

  app.post('/blogs', (req, res) => {
    const {
      content_blog,
      date_blog,
      id_user,
      picture_path_blog,
      title_blog
    } = req.body;
    console.log(req.body);
    connection.query(
      'INSERT INTO blogs (content_blog, date_blog, id_user, picture_path_blog, title_blog) VALUES (?, ?, ?, ?, ?);',
      [content_blog, date_blog, id_user, picture_path_blog, title_blog],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du blog" });
        } else {
          res.json(results);
        }
      }
    );
  });

  app.put('/blogs/:id', (req, res) => {
    const { id } = req.params;
    const { title_blog, picture_path_blog, content_blog, date_blog, id_user } = req.body;

    // Vérifier si toutes les colonnes requises sont fournies
    if (!title_blog || !picture_path_blog || !content_blog || !date_blog || !id_user) {
      return res.status(400).json({ error: "Toutes les colonnes sont requises" });
    }

    // Effectuer la requête de mise à jour dans la base de données
    const query =
      "UPDATE blogs SET title_blog = ?, picture_path_blog = ?, content_blog = ?, date_blog = STR_TO_DATE(?, '%Y-%d-%m'), id_user = ? WHERE id_blog = ?";
    // on utilise STR_TO_DATE() pour convertir la valeur de date_blog en un format de date compréhensible par MySQL
    const values = [title_blog, picture_path_blog, content_blog, date_blog, id_user, id];

    // Exécuter la requête SQL
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la mise à jour du blog" });
     } else {
        // Vérifier si des lignes ont été modifiées
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Blog non trouvé" });
        }

        // La mise à jour a réussi
        res.json({ message: "Mise à jour du blog réussie" });
      }
    });
  });

  app.delete('/blogs/:id', (req, res) => {
    const id_blog = req.params.id;
    connection.query('DELETE FROM blogs WHERE id_blog = ?', [id_blog], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Une erreur s'est produite lors de la suppression du blog" });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send('Blog non trouvé');
        } else {
          res.status(200).send('Blog supprimé avec succès');
        }
      }
    });
  });
};

module.exports = path;
