// Importation des différentes infrastructures et middlewares
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre (ici, toutes les 15 minutes)
  message: 'Trop de connexions provenant de la même adresse, réessayer plus tard'
})

// Initialisation des middlewares importés en haut du fichier...

app.use(express.json())
// Applique le middleware de limitation à toutes les requêtes
app.use(mongoSanitize())
// Applique l'assainissement des données fournies par l'utilisateur pour se prémunir des injections maveillantes
app.use(limiter)
// Applique le middleware CORS pour rendre le serveur accessible aux autre domaines
app.use(cors())
// Applique le bodyParser pour récuperer une valeur javascript utilisable 
app.use(bodyParser.json())

// ...Ainsi que des différentes routes nécessaires
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

// Exportation d'express afin de l'utiliser dans le fichier server.js
module.exports = app