// Importation de la librairie mongoose et de son plugin unique validator
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Initialisation du schéma utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Utilisation du plugin
userSchema.plugin(uniqueValidator)

// Exportation du schéma
module.exports = mongoose.model('User', userSchema)