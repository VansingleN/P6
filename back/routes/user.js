// Importation d'express et appel de sa méthode "Router" ainsi que du middleware de vérification de mot de passe
const express = require('express')
const router = express.Router()
const passwordChecking = require('../middleware/password-validator-config')

// Importation des fonctions du fichier controllers/user
const userCtrl = require('../controllers/user')

// Construction des différentes routes accédantes aux fonctions relatives aux utilisateurs
router.post('/signup', passwordChecking, userCtrl.signup)
router.post('/login', userCtrl.login)

// Exportation du router
module.exports = router