const passwordSchema = require('../models/Password')

module.exports = (req, res) => {

  if (!passwordSchema.validate(req.body.password)) 
  
    return res.status(400).json({message:'Le mot de passe doit contenir au moins 8 caractères dont une minuscule, une majuscule et un chiffre'})
}

