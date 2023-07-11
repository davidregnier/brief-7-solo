const bodyParser = require('body-parser'); // Importe le module body-parser pour analyser les corps de requête
const express = require('express'); // Importe le module Express pour la création du serveur
const mysql = require('mysql'); // Importe le module MySQL pour la gestion de la base de données
const fs = require('fs'); // Importe le module fs pour la gestion des fichiers

const app = express(); // Crée une instance de l'application Express
const port = process.env.PORT || 3000; // Définit le port sur lequel le serveur écoutera

app.use(express.urlencoded({ extended: true })); // Active le middleware pour la prise en charge des données URL encodées
app.use(bodyParser.urlencoded({ extended: true })); // Active le middleware body-parser pour analyser les corps de requête URL encodés
app.use(express.json()); // Active le middleware pour la prise en charge des données JSON

const connection = mysql.createConnection({
  host: 'localhost', // L'hôte de la base de données MySQL
  user: 'root', // Le nom d'utilisateur de la base de données
  password: 'root', // Le mot de passe de la base de données
  port: 3306, // Le port sur lequel la base de données est accessible
  database: 'dsi_sensibilisation', // Le nom de la base de données
  ssl: {
    ca: fs.readFileSync("c:/Users/utilisateur/certificate.crt"), // Chemin vers votre fichier de certificat
    key: fs.readFileSync('c:/Users/utilisateur/private.key'), // Chemin vers votre clé privée
    cert: fs.readFileSync('c:/Users/utilisateur/server.key') // Chemin vers votre certificat
  }
});

module.exports = { app, port, connection }; // Exporte l'application Express, le port et la connexion à la base de données

