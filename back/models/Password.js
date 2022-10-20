// Importation du middleware password-validator
const validPassword = require('password-validator')

// Initialisation du nouveau mot de passe
let passwordSchema = new validPassword()

// Schéma du mot de passe
passwordSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()

// Exportation du schéma de mot de passe
module.exports = passwordSchema