const { connection } = require('../server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secretKey = 'yourSecretKey';

const path = (app) => {
  app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users;', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des utilisateurs" });
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
        console.log('test');
        res.json(results);
      }
    });
  });

  app.post('/users', (req, res) => {
    const { id_user_contact, password_user, role_user } = req.body;
    const hashedPassword = hashPassword(password_user);

    connection.query(
      'INSERT INTO users (id_user_contact, password_user, role_user) VALUES (?, ?, ?);',
      [id_user_contact, hashedPassword, role_user],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout de l'utilisateur" });
        } else {
          res.json(results);
        }
      }
    );
  });

  app.patch('/users/:id', (req, res) => {
    const id_user = req.params.id;
    const new_user = req.body.new_user;

    connection.query(
      'UPDATE users SET users = ? WHERE id_user = ?',
      [new_user, id_user],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de l'utilisateur" });
        } else {
          if (result.affectedRows === 0) {
            res.status(404).send('Utilisateur non trouvé');
          } else {
            res.status(204).send("L'utilisateur a été mis à jour avec succès");
          }
        }
      }
    );
  });

  app.delete('/users/:id', (req, res) => {
    const id_user = req.params.id;
    connection.query('DELETE FROM users WHERE id_user = ?', [id_user], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Une erreur s'est produite lors de la suppression de l'utilisateur" });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send('Utilisateur non trouvé');
        } else {
          res.status(200).send("L'utilisateur a été supprimé avec succès");
        }
      }
    });
  });

  app.post('/users/login', (req, res) => {
    const { id_user_contact, password_user } =req.body;

    connection.query('SELECT * FROM users WHERE id_user_contact = ?;', [id_user_contact], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Une erreur s'est produite lors de la connexion de l'utilisateur" });
      } else {
        if (results.length === 0) {
          res.status(401).json({ error: 'Identifiants invalides' });
        } else {
          const user = results[0];
          const isPasswordValid = comparePassword(password_user, user.password_user);

          if (!isPasswordValid) {
            res.status(401).json({ error: 'Identifiants invalides' });
          } else {
            const token = generateToken(user);
            console.log('Token:', token); // Affiche le token dans la console
            res.json({ token });
          }
        }
      }
    });
  });
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const generateToken = (user) => {
  const payload = {
    userId: user.id_user
  };

  return jwt.sign(payload, secretKey);
};

module.exports = path;
