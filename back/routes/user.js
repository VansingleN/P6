// Importation d'express et appel de sa méthode "Router"
const express = require('express')
const router = express.Router()

// Importation des fonctions du fichier controllers/user
const userCtrl = require('../controllers/user')

// Construction des différentes routes accédantes aux fonctions relatives aux utilisateurs
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

// Exportation du router
module.exports = router