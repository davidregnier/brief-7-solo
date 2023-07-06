const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'dsi_sensibilisation',
  ssl: {
    ca: fs.readFileSync("c:/Users/utilisateur/certificate.crt"), // Chemin vers votre fichier de certificat
    key: fs.readFileSync('c:/Users/utilisateur/private.key'), // Chemin vers votre clé privée
    cert: fs.readFileSync('c:/Users/utilisateur/server.key') // Chemin vers votre certificat
  }
});

module.exports = { app, port, connection };
