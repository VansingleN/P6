// Importation d'express et définition de sa méthode "router"
const express = require('express')
const router = express.Router()

// Importation des fonctions du fichier controllers/sauce
const sauceCtrl = require('../controllers/sauce')
// Importation du middleware d'authentification d'utilisateur
const auth = require('../middleware/auth')
// Importation du middleware de gestion d'images multer
const multer = require('../middleware/multer-config')


// Construction des différentes routes accédantes aux fonctions relatives aux sauces
router.get('/', auth, sauceCtrl.getAllSauces)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.likeSauce);

// Exportation du router
module.exports = router