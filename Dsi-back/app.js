const express = require('express'); // Importe le module Express pour la création du serveur
const cors = require('cors'); // Importe le module CORS pour gérer les requêtes cross-origin
const path = require('./routes'); // Importe les modules des routes définies

const { app, port } = require('./server'); // Importe l'application Express et le port à partir du module './server'

app.use(cors()); // Active le middleware CORS pour gérer les requêtes cross-origin
app.use(express.urlencoded({ extended: true })); // Active le middleware pour la prise en charge des données URL encodées
app.use(express.json()); // Active le middleware pour la prise en charge des données JSON

path.blogsPath(app); // Utilise les routes définies pour les blogs à l'aide de la fonction blogsPath du module path
path.usersPath(app); // Utilise les routes définies pour les utilisateurs à l'aide de la fonction usersPath du module path

app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`); // Affiche un message lorsque le serveur est démarré et écoute sur le port spécifié
});

