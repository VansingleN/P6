// Importation du modèle de mot de passe
const passwordSchema = require('../models/Password')

// Exportation de la fonction permettant de vérifier la validité de la construction du mot de passe
module.exports = (req, res, next) => {

    if (!passwordSchema.validate(req.body.password)) {

        return res.status(400).json({message: 'Le mot de passe doit contenir au moins 8 caractères dont une minuscule, une majuscule et un chiffre'})
    }
    next()
}