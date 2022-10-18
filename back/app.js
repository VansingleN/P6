// Importation des différentes infrastructures et middlewares
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Décalration d'express dans une constante pour pouvoir la réutiliser plus bas
const app = express()

// Déclaration des différentes routes de l'API
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

// Connexion à la base de données MongoDB à l'aide de Mongoose et des variables d'environnement
mongoose.connect(`mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPassword}@cluster0.tyraz0k.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

// Initialisation des middlewares importés en haut du fichier...
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
// ...Ainsi que des différentes routes nécessaires
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

// Exportation d'express afin de l'utiliser dans le fichier server.js
module.exports = app