const express = require('express');
const cors = require('cors');
const path = require('./routes');
const { app, port } = require('./server');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

path.blogsPath(app);
path.usersPath(app);

app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});
