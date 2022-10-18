// Importation des json web tokens
const jwt = require('jsonwebtoken')

// Exportation de la fonction d'authentification des tokens afin de vérifier la validité de chaque utilisateur à chaque appel de route
module.exports = (req, res, next) => {
    try {
        // Récupération du token
        const token = req.headers.authorization.split(' ')[1]
        // Décodage
        const decodedToken = jwt.verify(token, process.env.secretToken)
         // Récupération du userId encodé à l'interieur
        req.auth = {
            userId: decodedToken.userId
        }
        next()
    }
    catch (error) {
        res.status(401).json({error})
    }
}